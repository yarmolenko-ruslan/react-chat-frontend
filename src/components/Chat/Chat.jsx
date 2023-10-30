import React from "react";
import { useEffect, useState, useRef } from "react";
import styles from "./chat.module.css";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import icon from "../../images/emoji.svg";
import EmojiPicker from "emoji-picker-react";
import Messages from "../Messages/Messages";

const socket = io.connect("http://localhost:2000");

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ user: "", room: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const messagesEndRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, params });

    setMessage("");
  };

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state]);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.header__info}>
          <div className={styles.title}>{params.room}</div>
          <div className={styles.users}>{users} онлайн</div>
        </div>
        <button className={styles.left} onClick={leftRoom}>
          {width > 560 ? "Выйти из комнаты" : ""}
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
        <div ref={messagesEndRef} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            placeholder={width > 560 ? "Что вы хотите сказать?" : "Пишите"}
            name="message"
            value={message}
            type="text"
            maxLength={250}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="Emoji" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <button className={styles.button}>
          {width > 560 ? "Отправить сообщение" : ""}
        </button>
      </form>
    </div>
  );
};

export default Chat;
