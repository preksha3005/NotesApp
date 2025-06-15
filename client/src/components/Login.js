import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particlesOptions from "../particles.json";
import Navbar from "./Navbar";
// import Navbar from "./Navbar";
const Login = () => {
  const [email, sete] = React.useState("");
  const [password, setp] = React.useState("");
  const [particlesVisible, setParticlesVisible] = React.useState(false);

  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesVisible(true);
    });
  }, []);

  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.backend_url}/loginapp`, { email, password })
      .then((result) => {
        if (result.data.message) {
          console.log(result.data.message);
          alert(result.data.message);
        } else {
          console.log(result.data);
          alert(result.data);
        }
        if (result.data.status) navigate("/notes");
      })
      .catch((err) => console.log(err));
    sete(" ");
    setp(" ");
  };
  axios.defaults.withCredentials = true;
  return (
    <div className="container">
      <Navbar/>
      <div className="box">
        <h2>Log-in</h2>
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
            Login
          </button>
        </form>
        <br />
        <div className="forgot">
          <Link to="/forgotpass" className="login">Forgot Password?</Link>
        </div>
        <p>
          Don't have an account? <Link to="/" className="login">Signup</Link>
        </p>
      </div>
      <div className="bg">
        {particlesVisible && <Particles options={particlesOptions} />}
      </div>
    </div>
  );
};

export default Login;
