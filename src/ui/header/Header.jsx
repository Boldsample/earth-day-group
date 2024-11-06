import { useTranslation } from "react-i18next"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark, faChevronLeft, faRightFromBracket, faShoppingCart } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { resetState } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import HeaderNotifications from "@components/modules/notifications/HeaderNotifications"
import { useEffect } from "react"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [t, i18n] = useTranslation('translation')
  const user = useSelector((state) => state.users.userData)
  const header = useSelector((state) => state.global.header)
  const headerTitle = useSelector((state) => state.global.headerTitle)

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  }

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [pathname])

  return <header className={'main_header '+header}>

    {user?.id &&
      <Nav />
    }

    <div className="navbar-item go-back">
      {user?.id && 
        <a onClick={() => navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></a>
      }
      {user?.id && !['map'].some((s) => s == header) && <>
        <ProfilePhoto userPhoto={user?.picture} className="left" />
        <small className="user-name" style={{fontSize: '1rem'}}>{t(`global.hi`)}, {user?.name}</small>
      </>}
    </div>


    {['settings'].some(s => s == header) && 
      	<div className="navbar-item">
			{headerTitle && <h4>{t(`settings.settings.${headerTitle}`)}</h4>}
		</div>
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
        <button className="lang" onClick={() => i18n.changeLanguage(i18n.language == 'es' ? 'en' : 'es')}>ES/EN</button>
        <a className="logout" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
      </div>
    }

    {!user?.id && 
      <div className="navbar-item right-align">
        <Link className="button small dark-blue" to="/login/">{t(`global.login`)}</Link>
        <button className="small" onClick={() => i18n.changeLanguage(i18n.language == 'es' ? 'en' : 'es')}>ES/EN</button>
      </div>
    }
  </header>
}

export default Header