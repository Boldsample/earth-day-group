import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { faBookmark, faChevronLeft, faRightFromBracket, faShoppingCart, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { resetState } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import HeaderNotifications from "@components/modules/notifications/HeaderNotifications"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.users.userData)
  const header = useSelector((state) => state.global.header)
  const headerTitle = useSelector((state) => state.global.headerTitle)

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  }

  return <header className={'main_header '+header}>

    {!['intro', 'login', 'register'].some(s => s == header) &&
      <Nav />
    }

    <div className="navbar-item go-back">
      {!['intro', 'dashboard', 'thankyou'].some((s) => s == header) && 
        <a onClick={() => navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></a>
      }
      {user?.id && !['map'].some((s) => s == header) && <>
        <ProfilePhoto userPhoto={user?.picture} className="left" />
        <small className="user-name" style={{fontSize: '1rem'}}>Hi, {user?.name}</small>
      </>}
    </div>


    {['settings'].some(s => s == header) && 
      <div className="navbar-item"><h4>{headerTitle}</h4></div>
    }
    
    {!['settings', 'map'].some(s => s == header) && 
      <div className="navbar-item logo">
        <Link to="/"><img src="/assets/earth-day-group.png" alt="Earth Day Group" /></Link>
      </div>
    }

    {['map'].some(s => s == header) && <div></div>}

    {user?.id && 
      <div className="navbar-item right-align icons">
        {!['settings', 'map'].some(s => s == header) && user?.role == 'user' && <>
          <FontAwesomeIcon icon={faShoppingCart} />
          <Link to="/products/saved/"><FontAwesomeIcon icon={faBookmark} /></Link>
        </>}
        <HeaderNotifications />
        <a onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
      </div>
    }

    {!user?.id && 
      <div className="navbar-item right-align">
        <Link className="button dark-blue" to="/login/">Log in</Link>
      </div>
    }
  </header>
}

export default Header