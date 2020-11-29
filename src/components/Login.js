import { Link } from "react-router-dom";
import React from "react";
import "./FormAuthentication.scss";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <Link to="/login">
          <img
            className="logo-text"
            src="https://svgshare.com/i/Rq0.svg"
            alt=""
          />
        </Link>
        <h1 className="h1-form">Log in</h1>
        <form onSubmit={console.log("form submitted")}>
          <input
            type="text"
            placeholder="Email"
            className="input input--email"
          />
          <input
            type="password"
            placeholder="Password"
            className="input input--password"
          />
          <button type="submit" className="btn btn--demo">
            Log in as a demo user
          </button>
          <button type="submit" className="btn btn--log-in">
            Log in
          </button>
        </form>
        <h4 className="h4-form">
          No email or password is required to log in as a demo user
        </h4>
        <h5 className="h5-form">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </h5>
      </div>
    );
  }
}

export default Login;
