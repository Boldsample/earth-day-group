import { useRef } from "react"
import Cookies from "js-cookie"
import { Menu } from "primereact/menu"
import { Dropdown } from "primereact/dropdown"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { faChevronLeft, faGear, faRightFromBracket, faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons"
import { Tooltip } from "primereact/tooltip"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { resetState } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import HeaderNotifications from "@components/modules/notifications/HeaderNotifications"

const Header = () => {
  const menu = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t, i18n] = useTranslation('translation')
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const user = useSelector((state) => state.users.userData)
  const header = useSelector((state) => state.global.header)
  const {headerTitle, prevPage} = useSelector((state) => state.global)

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  }

  return <header className={'main_header '+header}>

    {user?.id &&
      <Nav />
    }

    <div className="navbar-item go-back">
      {user?.id && 
        <Link to={prevPage}><FontAwesomeIcon icon={faChevronLeft} /></Link>
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
          <Tooltip target=".cart" showDelay={700}/>
          <FontAwesomeIcon className="cart" data-pr-tooltip={tToolTip("cart")} data-pr-position="bottom" icon={faShoppingCart} />
          <Tooltip target=".bookmarks" showDelay={700}/>
          <Link data-pr-tooltip={tToolTip("bookmarks")} data-pr-position="bottom" className="bookmarks hide__mobile" to="/bookmarks/products/saved/"><FontAwesomeIcon icon={faHeart} /></Link>
        </>}
        <HeaderNotifications />
		    <div>
          <Menu ref={menu} popup model={[
            {
              label: t(`global.language`),
              template: <div className="menuDropdown">
                <label>{t(`global.language`)}</label>
                <Dropdown
                  optionLabel="label"
                  optionValue="value"
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.value)}
                  options={[
                    { label: 'Español', value: 'es' },
                    { label: 'English', value: 'en' },
                  ]}
                />
              </div>
            },
            {
              label: t(`global.currency`),
              template: <div className="menuDropdown">
                <label>{t(`global.currency`)}</label>
                <Dropdown
                  optionLabel="label"
                  optionValue="value"
                  value={Cookies.get('edgUserCurrency')}
                  onChange={(e) => Cookies.set('edgUserCurrency', e.value)}
                  options={[
                    { label: 'USD', value: 'usd' },
                    { label: 'COP', value: 'cop' },
                  ]}
                />
              </div>
            }
          ]} />
          <Tooltip target=".config" showDelay={700}/>
          <Link data-pr-tooltip={tToolTip("settings")} data-pr-position="bottom" className="config hide__mobile" onClick={(event) => menu.current.toggle(event)}><FontAwesomeIcon icon={faGear} /></Link>
        </div>
        <Tooltip target=".logout" showDelay={700}/>
        <a className="logout" data-pr-tooltip={tToolTip("logout")} data-pr-position="bottom" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
      </div>
    }

    {!user?.id && 
      <div className="navbar-item right-align">
		{['login'].some(s => s != header) && 
        	<Link className="button small dark-blue" to="/login/">{t(`global.login`)}</Link>
		}
        <button className="hide__mobile small" onClick={() => i18n.changeLanguage(i18n.language == 'es' ? 'en' : 'es')}>ES/EN</button>
      </div>
    }
  </header>
}

export default Header