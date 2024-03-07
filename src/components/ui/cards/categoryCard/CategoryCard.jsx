import React from "react";
import "./categoryCard.sass";

const CategoryCard = ({
  backgroundColor,
  height,
  fontColor,
  title,
  description,
  iconBackgroundColor,
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
    <div className="category-Card" style={cardStyle}>
      <div className="category-Card-Icon" style={iconBackground}></div>
      <h3 style={textStyle}>{title}</h3>
      <p style={textStyle}>{description}</p>
    </div>
  );
};

export default CategoryCard;
