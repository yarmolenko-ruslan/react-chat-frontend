import React from "react";
import { useEffect, useState } from "react";
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

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}>{users} онлайн</div>
        <button className={styles.left} onClick={leftRoom}>
          Выйти из комнаты
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            placeholder="Что вы хотите сказать?"
            name="message"
            value={message}
            type="text"
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

        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Отправить сообщение" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
