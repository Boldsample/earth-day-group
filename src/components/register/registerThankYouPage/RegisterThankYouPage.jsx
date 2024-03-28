import React from "react";
import { Button } from "primereact/button";
import "./registerThankYouPage.sass";
import { Link } from "react-router-dom";

const RegisterThankYouPage = () => {
  return (
    <div className="thankYouPage__layout">
      <div className="thankYouPage__container">
        <h1>Congrats!</h1>
        <p>You're all signed up! We sent you a link to verify your identity</p>
        <Link to="/login/">
        <Button style={{ margin: "0px", width: "80%" }} label="Login" />
        </Link>
      </div>
    </div>
  );
};

export default RegisterThankYouPage;
