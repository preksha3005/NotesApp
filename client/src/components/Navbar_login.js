import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Navbar_login = () => {
  const [initial, seti] = React.useState("");
  const navigate = useNavigate();

  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

  React.useEffect(() => {
    axios
      .get(`/initial`)
      .then((res) => seti(res.data.initial))
      .catch((err) => console.log("Error"));
  }, []);
  const handlelog = () => {
    axios
      .get(`/logout`)
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <nav className=" nav-login archivo-black-regular">
      <ul className="navbar">
        <li>Notes</li>
      </ul>
      <ul className="prof">
        <li>
          <div className="initial">{initial}</div>
        </li>
        <li>
          <a onClick={handlelog} className="logout">
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar_login;
