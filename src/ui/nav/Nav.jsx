import React from "react";
import "./nav.sass";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const userRole = useSelector((state) => state?.users?.userData?.role);
  let sections = [];

  sections.push({
    label: "Home",
    icon: "/assets/icons/home.svg",
    path: "/dashboard/",
  });
  if (userRole === "user") {
    sections.push({
      label: "Location",
      icon: "/assets/icons/location.svg",
      path: "/location/",
    });
    sections.push({
      label: "Inbox",
      icon: "/assets/icons/inbox.svg",
      path: "/orders/",
    });
    sections.push({
      label: "Shop",
      icon: "/assets/icons/shop.svg",
      path: "",
    });
  }
  if (userRole === "company") {
    sections.push({
      label: "Profile",
      icon: "/assets/icons/userProfile.svg",
      path: "/profile/",
    });
    sections.push({
      label: "Inbox",
      icon: "/assets/icons/inbox.svg",
      path: "/orders/",
    });
  }

  sections.push({
    label: "Settings",
    icon: "/assets/icons/settings.svg",
    path: "/settings/",
  });

  // const sections = [
  // 	{ label: "Home", icon: '/assets/icons/home.svg', path: "/dashboard/" },
  // 	{ label: "Location", icon: '/assets/icons/location.svg', path: "/location/" },
  // 	{ label: "Inbox", icon: '/assets/icons/inbox.svg', path: "/orders/" },
  // 	{ label: "Shop", icon: '/assets/icons/shop.svg', path: "" },
  // 	{ label: "Settings", icon: '/assets/icons/settings.svg', path: "/settings/" },
  // ];
  return (
    <div className="nav__container">
      {sections.map((section, key) => {
        return (
          <Link key={key} to={section.path}>
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
        );
      })}
    </div>
  );
};

export default Nav;
