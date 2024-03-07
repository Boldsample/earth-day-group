import React from "react";
import CategoryCard from "../../ui/cards/categoryCard/CategoryCard";
import './register.sass'
import userIcon from '../../../assets/registerCategories/registerCat-1.svg'
import recycleIcon from '../../../assets/registerCategories/registerCat-2.svg'
import shelterIcon from '../../../assets/registerCategories/registerCat-3.svg'
import ecommerceIcon from '../../../assets/registerCategories/registerCat-4.svg'
import backgroundImg from '../../../assets/registerCategories/registerCatBackground.svg'

const Register = () => {
  return (
    <>
    <div className="category__container">
    <img className="background" src={backgroundImg}/>
        <div className="content__container">
          <h4 className="category__title">Register as:</h4>
          <div className="category-Grid">
            <CategoryCard
              backgroundColor="#77BEF9"
              iconBackgroundColor="#23649A"
              height="200px"
              fontColor="#fff"
              title="User:"
              description="Explore the marketplace and connect with companies and charity homes."
              icon={userIcon}
            />
            <CategoryCard
              backgroundColor="#7FAE70"
              iconBackgroundColor="#408D27"
              height="200px"
              fontColor="#fff"
              title="Recycling Center:"
              description="Register your recycling center or company and extend your operation area."
              icon={recycleIcon}
            />
            <CategoryCard
              backgroundColor="#23649A"
              iconBackgroundColor="#77BEF9"
              height="234px"
              fontColor="#fff"
              title="Social Organization Animal Shelter:"
              description="Register your social organization and let many more people know about your work."
              icon={shelterIcon}
            />
            <CategoryCard
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
    </div>
    
    </>
  );
};

export default Register;
