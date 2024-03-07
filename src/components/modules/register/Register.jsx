import React from "react";
import CategoryCard from "../../ui/cards/categoryCard/CategoryCard";
import Header from "../../layout/Header";

const Register = () => {
  return (
    <>
      <div className="category__container">
        <h3 className="category__title">Register as:</h3>
        <div className="category-Grid">
          <CategoryCard
            backgroundColor="#77BEF9"
            iconBackgroundColor="#23649A"
            height="200px"
            fontColor="#fff"
            title="User:"
            description="Explore the marketplace and connect with companies and charity homes."
          />
          <CategoryCard
            backgroundColor="#7FAE70"
            iconBackgroundColor="#408D27"
            height="200px"
            fontColor="#fff"
            title="Recycling Center:"
            description="Register your recycling center or company and extend your operation area."
          />
          <CategoryCard
            backgroundColor="#23649A"
            iconBackgroundColor="#77BEF9"
            height="200px"
            fontColor="#fff"
            title="Social Organization Animal Shelter:"
            description="Register your social organization anf let many more people know about your work."
          />
          <CategoryCard
            backgroundColor="#408D27"
            iconBackgroundColor="#7FAE70"
            height="200px"
            fontColor="#fff"
            title="Eco-Commerce:"
            description="Register your Eco-Commerce and let more people know about your enviromentally friendly products."
          />
        </div>
      </div>
    </>
  );
};

export default Register;
