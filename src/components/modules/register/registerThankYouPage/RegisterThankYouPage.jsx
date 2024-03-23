import React from "react";
import { Button } from "primereact/button";
import "./registerThankYouPage.sass";

const RegisterThankYouPage = () => {
  return (
    <div className="layout">
      <div className="thankYouPage__container">
        <h1>Congrats</h1>
        <p>You're all signed up! We sent you a link to verify your identity</p>
        <Button label="Login" />
      </div>
    </div>
  );
};

export default RegisterThankYouPage;
