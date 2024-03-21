import React from "react";
import "./registerCategories.sass";
import CategoryCard from "@ui/cards/categoryCard/CategoryCard";
import userIcon from "@assets/registerCategories/registerCat-1.svg";
import recycleIcon from "@assets/registerCategories/registerCat-2.svg";
import shelterIcon from "@assets/registerCategories/registerCat-3.svg";
import ecommerceIcon from "@assets/registerCategories/registerCat-4.svg";
import backgroundImg from "@assets/registerCategories/registerCatBackground.svg";
import { Link } from "react-router-dom";
import GoBackButton from "../../../../ui/buttons/goBackButton/GoBackButton";

const registerCategories = () => {
  return (
    <>
      <div className="category__container">
        <img className="category__background" src={backgroundImg} />
        <div className="content__container">
          <h4 className="category__title">Register as:</h4>
          <div className="category__grid">
            <Link to="/register/user/">
            <CategoryCard
              hoverBackgroundColor="#23649A"
              hoverIconColor="#77BEF9"
              backgroundColor="#77BEF9"
              iconBackgroundColor="#23649A"
              height="200px"
              fontColor="#fff"
              title="User:"
              description="Explore the marketplace and connect with companies and charity homes."
              icon={userIcon}
            />
            </Link>
            <CategoryCard
              hoverBackgroundColor="#408D27"
              hoverIconColor="#7FAE70"
              backgroundColor="#7FAE70"
              iconBackgroundColor="#408D27"
              height="200px"
              fontColor="#fff"
              title="Recycling Center:"
              description="Register your recycling center or company and extend your operation area."
              icon={recycleIcon}
            />
            <CategoryCard
              hoverBackgroundColor="#77BEF9"
              hoverIconColor="#23649A"
              backgroundColor="#23649A"
              iconBackgroundColor="#77BEF9"
              height="234px"
              fontColor="#fff"
              title="Social Organization Animal Shelter:"
              description="Register your social organization and let many more people know about your work."
              icon={shelterIcon}
            />
            <CategoryCard
              hoverBackgroundColor="#7FAE70"
              hoverIconColor="#408D27"
              backgroundColor="#408D27"
              iconBackgroundColor="#7FAE70"
              height="234px"
              fontColor="#fff"
              title="Eco-Commerce:"
              description="Register your Eco-Commerce and let more people know about your enviromentally friendly products."
              icon={ecommerceIcon}
            />
          </div>
        </div>
        <Link to="/">
          <GoBackButton/>
        </Link>
      </div>
    </>
  );
};

export default registerCategories;
