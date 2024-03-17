import React, { useState } from "react";
import "./categoryCard.sass";

const CategoryCard = ({
  backgroundColor,
  hoverBackgroundColor,
  hoverIconColor,
  height,
  fontColor,
  title,
  description,
  iconBackgroundColor,
  icon,
}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const cardStyle = {
    backgroundColor: hovered ? hoverBackgroundColor : backgroundColor,
    maxHeight: height,
    transition: "background-color 0.3s ease",
  };

  const iconBackground = {
    backgroundColor: hovered ? hoverIconColor : iconBackgroundColor,
    transition: "background-color 0.3s ease",
  };

  const textStyle = {
    color: fontColor,
  };

  return (
    <div
      className="category__card"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="category__card-Icon" style={iconBackground}>
        <img src={icon} alt="Category Icon" />
      </div>
      <h3 style={textStyle}>{title}</h3>
      <p style={textStyle}>{description}</p>
    </div>
  );
};

export default CategoryCard;
