import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { faBell, faRightFromBracket, faShoppingCart } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import logo from "@assets/earth-day-group.png"
import { updateUser } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

const Header = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const user = useSelector((state) => state.users.userData);

	useEffect(() => {
		console.log(user)
		if(user?.id && ['/', '/register/', '/register/user/', '/login/', '/recover/'].some(url => url==location.pathname))
			navigate('/dashboard/')
		else if(!user?.id && ['/dashboard/', '/dashboard/notifications/'].some(url => url==location.pathname))
			navigate('/login/')
	}, [user, location])

	return (
		<header>
		{user?.id ? <div className="navbar-item user-info">
			<ProfilePhoto />
			<small className="user-name">Hi, {user.name}</small>
		</div> : null}
		<div className="navbar-item logo">
			<Link to="/"><img src={logo} alt="Earth Day Group" /></Link>
		</div>
		{user?.id ? <>
			<div className="navbar-item icons">
				<FontAwesomeIcon icon={faShoppingCart} />
				<Link to={"/dashboard/notifications"}><FontAwesomeIcon icon={faBell} /></Link>
				<a onClick={e => dispatch(updateUser({}))}><FontAwesomeIcon icon={faRightFromBracket} /></a>
			</div>
			<Nav />
		</> : null}
		{!user?.id && !window.location.pathname.includes('login') ? <div className="navbar-item">
			<Link className="button dark-blue" to="/login/">Log in</Link>
		</div> : null }
		</header>
	);
};
export default Header;
