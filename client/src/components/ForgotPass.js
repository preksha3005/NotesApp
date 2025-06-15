import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
const ForgotPass = () => {
  const [email, sete] = React.useState("");
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forgotpass", { email })
      .then((result) => {
        if (result.data.status) {
          alert("Check your mail")
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
    sete(" ");
  };
  axios.defaults.withCredentials = true;
  return (
    <div className="container">
    {/*<Navbar/>*/}
      <div className="box">
        <h2>Forgot Password</h2>
        <form onSubmit={handle} className="form1">
          <input
            type="email"
            placeholder="Enter email"
            className="email"
            name="email"
            required
            onChange={(e) => sete(e.target.value)}
          />

          <br />
          <br />
          <button type="submit" className="reg">
            Send
          </button>
        </form>
        <br />
      </div>
    </div>
  );
};

export default ForgotPass;
