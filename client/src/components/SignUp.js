import React from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particlesOptions from "../particles.json";
import Navbar from "./Navbar";
// import Navbar from "./Navbar";
const SignUp = () => {
  const [name, setn] = React.useState("");
  const [email, sete] = React.useState("");
  const [password, setp] = React.useState("");
  const navigate=useNavigate()
  const [particlesVisible, setParticlesVisible] = React.useState(false);

  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesVisible(true);
    });
  }, []);
  const handle=(e)=>{
    e.preventDefault();
    axios
      .post(`/sign`, { name, email, password })
      .then((result) => {
        if (result.data.message) {
          console.log(result.data.message);
          alert(result.data.message);
        } else {
          console.log(result.data);
          alert(result.data);
        }
        if (result.data.status) navigate("/login");
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="container">
    <Navbar/>
      <div className="box">
        <h2>SignUp</h2>
        <form onSubmit={handle} className="form">
          <input
            type="text"
            placeholder="Enter name"
            className="name"
            name="name"
            required
            onChange={(e) => setn(e.target.value)}
          />
          <br />
          <br />
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
            SignUp
          </button>
          
        </form>
        <p>
            Already have an account? <Link to="/login" className="login">Login</Link>
          </p>
      </div>

      <div className="bg">
        {particlesVisible && <Particles options={particlesOptions} />}
      </div>
    </div>
  );
};
export default SignUp;
