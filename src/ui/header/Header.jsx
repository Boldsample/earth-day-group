import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { faRightFromBracket, faShoppingCart } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { resetState } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { updateAddLink } from '@store/slices/globalSlice'
import HeaderNotifications from "@components/modules/notifications/HeaderNotifications"

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.users.userData)
  const header = useSelector((state) => state.global.header)
  const addLink = useSelector((state) => state.global.addLink)
  const headerTitle = useSelector((state) => state.global.headerTitle)

  const logout = async (e) => {
    if(await logoutUser())
      dispatch(resetState())
  };

  useEffect(() => {
    if(!['/offers/'].some(url => url == location.pathname))
      dispatch(updateAddLink(''))
  }, [location])

  return <header className={'main_header '+header}>
    {['dashboard'].some(s => s == header) && 
      <div className="navbar-item user-info">
        <ProfilePhoto userPhoto={user?.picture} className="left" />
        <small className="user-name">Hi, {user?.name}</small>
      </div>
    }

    {!['intro', 'dashboard', 'thankyou'].some((s) => s == header) && 
      <div className="navbar-item go-back">
        <a onClick={() => navigate(-1)}><i className="pi pi-angle-left" /></a>
        {addLink && <Link className="plus" to={addLink}><i className="pi pi-plus" /></Link>}
      </div>
    }

    {['settings'].some(s => s == header) && 
      <div className="navbar-item"><h4>{headerTitle}</h4></div>
    }
    
    {!['settings', 'map'].some(s => s == header) && 
      <div className="navbar-item logo">
        <Link to="/"><img src="/assets/earth-day-group.png" alt="Earth Day Group" /></Link>
      </div>
    }

    {['map'].some(s => s == header) && <div></div>}

  {!['intro', 'login', 'register'].some(s => s == header) && 
    <div className="navbar-item icons">
      {!['intro', 'login', 'register', 'settings', 'map'].some(s => s == header) && <>
        {location.pathname != '/dashboard/' ? <div className="navbar-item" style={{ width: 'auto'}}>
          <ProfilePhoto userPhoto={user?.picture} />
          <small className="user-name">Hi, {user?.name}</small>
        </div> : null}
        <FontAwesomeIcon icon={faShoppingCart} />
      </>}
      <HeaderNotifications />
      {!['intro', 'login', 'register', 'settings', 'map'].some(s => s == header) && <>
        <a onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
      </>}
    </div>
  }

    {!['intro', 'login', 'register'].some(s => s == header) &&
      <Nav />
    }

    {["intro", "register"].some((s) => s == header) && <div className="navbar-item">
      <Link className="button dark-blue" to="/login/">Log in</Link>
    </div>}
  </header>
}

export default Header