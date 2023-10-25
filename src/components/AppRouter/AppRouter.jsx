import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "../Chat/Chat";
import Main from "../Main/Main";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default AppRouter;
