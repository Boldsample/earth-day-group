import logo from "../../assets/earth-day-group.png";
import { getUserData } from "@store/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {Button} from 'primereact/button'
import { Link } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.users.userData);
  console.log(user, "in header");
  // noNav
  // LoginNav
  // Nav
  return (
    <header>
      {Object.keys(user).length != 0 ? ( <div className="navbar-item user-info">
        <ProfilePhoto />
        <span className="user-name">Hi, {user.name}</span>
      </div>) : (null) }
      <div className="navbar-item logo">
        <img src={logo} alt="Earth Day Group" />
      </div>
      {Object.keys(user).length != 0 ? ( <div className="navbar-item icons">
        <FontAwesomeIcon icon={faShoppingCart} />
        <FontAwesomeIcon icon={faBell} />
      </div>) : 
      (<div className="navbar-item">
           <Link className="button secondary" to="/login/">Log in</Link>
        </div>) }
      
    </header>
  );
};
export default Header;
