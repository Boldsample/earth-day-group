import React from "react";
import "./categoryCard.sass";

const CategoryCard = ({
  backgroundColor,
  height,
  fontColor,
  title,
  description,
  iconBackgroundColor,
  icon
}) => {
  const cardStyle = {
    backgroundColor: backgroundColor,
    maxHeight: height,
  };

  const iconBackground = {
    backgroundColor: iconBackgroundColor,
  };

  const textStyle = {
    color: fontColor,
  };

  return (
    <div className="category__card" style={cardStyle}>
      <div className="category__card-Icon" style={iconBackground}>
      <img src={icon} alt="Category Icon" />
      </div>
      <h3 style={textStyle}>{title}</h3>
      <p style={textStyle}>{description}</p>
    </div>
  );
};

export default CategoryCard;
