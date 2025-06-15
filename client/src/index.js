import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Notes from "./components/Notes";
import ForgotPass from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";

const root = ReactDOM.createRoot(document.getElementById("root"));
const Page = () => {
  return (
    <BrowserRouter>
      {/*<NotesProvider>*/}
        <Routes>
          <Route path="/" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/notes" element={<Notes />}></Route>
          <Route path="/forgotpass" element={<ForgotPass />}></Route>
          <Route path="/resetpass/:token" element={<ResetPass />}></Route>
        </Routes>
      {/*</NotesProvider>*/}
    </BrowserRouter>
  );
};
root.render(<Page />);
