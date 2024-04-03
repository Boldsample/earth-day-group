import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { faBell, faRightFromBracket, faShoppingCart } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { updateUser } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { updateAddLink } from '@store/slices/globalSlice'

const Header = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const user = useSelector((state) => state.users.userData)
	const addLink = useSelector((state) => state.global.addLink)

	const logout = async (e) => {
		e.preventDefault()
		if(await logoutUser())
			dispatch(updateUser({}))
	}

	useEffect(() => {
		if(!['/offers/'].some(url => url==location.pathname))
			dispatch(updateAddLink(''))

		if(user?.id && ['/register/user/'].some(url => url==location.pathname))
			navigate('/thankyou/')
		else if(user?.id && ['/', '/register/', '/login/', '/recover/'].some(url => url==location.pathname))
			navigate('/dashboard/')
		else if(!user?.id && ['/dashboard/', '/dashboard/notifications/'].some(url => url==location.pathname))
			navigate('/login/')
	}, [user, location])

	return <header>
		{user?.id && location.pathname == '/dashboard/' ? <div className="navbar-item user-info">
			<ProfilePhoto userPhoto={user.picture} className="left" />
			<small className="user-name">Hi, {user.name}</small>
		</div> : null}
		{!['/', '/dashboard/'].some(url => url==location.pathname) ? <div className="navbar-item go-back">
			<a onClick={() => navigate(-1)}><i className="pi pi-angle-left" /></a>
			{addLink && <Link className="plus" to={addLink}><i className="pi pi-plus" /></Link>}
		</div> : null}
		<div className="navbar-item logo">
			<Link to="/"><img src="/assets/earth-day-group.png" alt="Earth Day Group" /></Link>
		</div>
		{user?.id ? <>
			<div className="navbar-item icons">
				{location.pathname != '/dashboard/' ? <div className="navbar-item" style={{ width: 'auto'}}>
					<ProfilePhoto userPhoto={user.picture} />
					<small className="user-name">Hi, {user.name}</small>
				</div> : null}
				<FontAwesomeIcon icon={faShoppingCart} />
				<Link to={"/dashboard/notifications"}><FontAwesomeIcon icon={faBell} /></Link>
				<a onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
			</div>
			<Nav />
		</> : null}
		{!user?.id && ['/', '/register/', '/register/user/', '/recover/'].some(url => url==location.pathname) ? <div className="navbar-item">
			<Link className="button dark-blue" to="/login/">Log in</Link>
		</div> : null }
	</header>
}

export default Header