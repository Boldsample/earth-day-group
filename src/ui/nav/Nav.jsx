import React from "react";
import "./nav.sass";
import { Tooltip } from "primereact/tooltip";
import home from "@assets/navBar-icons/navIcon-1.svg";
import location from "@assets/navBar-icons/navIcon-2.svg";
import inbox from "@assets/navBar-icons/navIcon-3.svg";
import shop from "@assets/navBar-icons/navIcon-4.svg";
import settings from "@assets/navBar-icons/navIcon-5.svg";
import { Link } from "react-router-dom";

const Nav = () => {
  const sections = [
    { label: "Home", icon: home, path: "/dashboard/" },
    { label: "Location", icon: location, path: "" },
    { label: "Inbox", icon: inbox, path: "" },
    { label: "Shop", icon: shop, path: "" },
    { label: "Settings", icon: settings, path: "" },
  ];
  return (
    <div className="nav__container">
      {sections.map((section) => {
        return (
          <>
          <Link to={section.path}>
            <Tooltip target=".custom-target-icon" />
            <img
              data-pr-tooltip={section.label}
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
              className="custom-target-icon"
              key={section.label}
              src={section.icon}
            ></img>
          </Link>
          </>
        );
      })}
    </div>
  );
};

export default Nav;
