import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./main.module.css";

const FIELDS = {
  NAME: "name",
  ROOM: "room",
};

const Main = () => {
  const { NAME, ROOM } = FIELDS;
  const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((value) => !value);

    if (isDisabled) e.preventDefault();

  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Вход</h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <input
              className={styles.input}
              placeholder="Имя пользователя"
              name="name"
              value={values[NAME]}
              type="text"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              className={styles.input}
              placeholder="Название комнаты"
              name="room"
              value={values[ROOM]}
              type="text"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <Link
            className={styles.group}
            onClick={handleClick}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
          >
            <button className={styles.button} type="submit">
              Войти
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
