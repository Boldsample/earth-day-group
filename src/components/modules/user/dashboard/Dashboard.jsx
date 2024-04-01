import React, { useState } from "react";
import TextInput from "@ui/forms/textInput/TextInput";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import modules from "./modules";
import { Link } from "react-router-dom";
import Card from "@ui/cards/Card";

import "./dashboard.sass";

const Dashboard = () => {
  const [filteredModule, setFilteredModule] = useState([]);
  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(filteredModule)
  );

  return (
    <div className="layout">
      <div className="main__content -dashboard-container">
        <div className="category__search">
          <h4>Discover:</h4>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              className="p-inputtext"
              placeholder="Search"
              onChange={(e) => {
                setFilteredModule(e.target.value);
              }}
            />
          </span>
        </div>
        <div className="category__grid -dashboard">
          {filteredModules.length > 0
            ? filteredModules.map((module, key) => (
                <Link to={module.link} key={key}>
                  <Card
                    hoverBackgroundColor={module.hoverBackgroundColor}
                    hoverIconColor={module.hoverIconColor}
                    backgroundColor={module.backgroundColor}
                    iconBackgroundColor={module.iconBackgroundColor}
                    height={module.height}
                    fontColor={module.fontColor}
                    title={module.title}
                    description={module.description}
                    icon={module.icon}
                    className="-dashboard-card"
                  />
                </Link>
              ))
            : "No modules found."}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
