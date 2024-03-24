import React from "react";
import "./nav.sass";
import { Tooltip } from "primereact/tooltip";
import home from "@assets/navBar-icons/navIcon-1.svg";
import location from "@assets/navBar-icons/navIcon-2.svg";
import inbox from "@assets/navBar-icons/navIcon-3.svg";
import shop from "@assets/navBar-icons/navIcon-4.svg";
import settings from "@assets/navBar-icons/navIcon-5.svg";

const Nav = () => {
  const sections = [
    { label: "Home", icon: home },
    { label: "Location", icon: location },
    { label: "Inbox", icon: inbox },
    { label: "Shop", icon: shop },
    { label: "Settings", icon: settings },
  ];
  return (
    <div className="nav__container">
      {sections.map((section) => {
        return (
          <>
            <Tooltip target=".custom-target-icon" />
            <img
              data-pr-tooltip={section.label}
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
              className="custom-target-icon"
              style={{
                cursor: "pointer",
              }}
              key={section.label}
              src={section.icon}
            ></img>
          </>
        );
      })}
    </div>
  );
};

export default Nav;
