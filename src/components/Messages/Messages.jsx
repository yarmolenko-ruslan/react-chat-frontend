import styles from "./messages.module.css";
import React from "react";

const Messages = ({ messages, name }) => {
  return (
    <div className={styles.messages}>
      {messages.map(({ user, message }, i) => {
        const itsMe =
          user.name.trim().toLowerCase() === name.trim().toLowerCase();

        const className = itsMe ? styles.me : styles.user;

        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <span className={styles.user}>{user.name}</span>
            <div className={styles.text}>{message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
