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
  className
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
      className={`category__card ${className}`}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="category__card-Icon" style={iconBackground}>
        <img src={icon} alt="Category Icon" />
      </div>
      <h4 className="text-defaultCase" style={textStyle}>
        {title}
      </h4>
      <p style={textStyle}>{description}</p>
    </div>
  );
};

export default CategoryCard;
