import React from "react";
import axios from "axios";
import { useNavigate,Link,useParams } from "react-router-dom";
// import Navbar from "./Navbar";
const ResetPass = () => {
  const [password, setp] = React.useState("");
  const {token}=useParams()
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.backend_url}/resetpass/`+token, { password })
      .then((result) => {
        if (result.data.status) navigate("/login");
      })
      .catch((err) => console.log(err));
    setp(" ");
  };
  axios.defaults.withCredentials=true;
  return (
    <div className="container">
    {/*<Navbar/>*/}
      <div className="box">
        <h2>Reset Password</h2>
        <form onSubmit={handle} className="form1">
          <input
            type="password"
            placeholder="Enter password"
            className="password"
            name="password"
            required
            onChange={(e) => setp(e.target.value)}
          />
          <br />
          <br />
          <button type="submit" className="reg">
            Reset
          </button>
         
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
