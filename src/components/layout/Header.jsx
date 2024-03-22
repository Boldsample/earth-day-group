import logo from "../../assets/earth-day-group.png";
import { getUserData } from "@store/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const user = useSelector((state) => state.users.userData);
  console.log(user, "in header");
  // noNav
  // LoginNav
  // Nav
  return (
    <header>
      <div class="navbar-item user-info">
        <ProfilePhoto />
        <span class="user-name">John Doe</span>
      </div>
      <div className="navbar-item logo">
        <img src={logo} alt="Earth Day Group" />
        {/* <button>login</button> */}
      </div>
      <div class="navbar-item icons">
        <FontAwesomeIcon icon={faBell} />
        <FontAwesomeIcon icon={faShoppingCart} />
      </div>
    </header>
  );
};
export default Header;
