import { useRef } from "react"
import { Menu } from "primereact/menu"
import { Tooltip } from "primereact/tooltip"
import { Dropdown } from "primereact/dropdown"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faRightFromBracket, faShoppingCart, faHeart, faBell, faBars, faSliders, faLanguage, faCoins } from "@fortawesome/free-solid-svg-icons"

import Nav from "@ui/nav/Nav"
import { logoutUser } from "@services/userServices"
import { resetState } from "@store/slices/usersSlice"
import { setCurrency } from "@store/slices/globalSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import HeaderNotifications from "@components/modules/notifications/HeaderNotifications"

const Header = () => {
  let preferences = []
  const menu = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuMobile = useRef(null)
  const [t, i18n] = useTranslation('translation')
  const user = useSelector((state) => state.users.userData)
  const header = useSelector((state) => state.global.header)
  const currency = useSelector((state) => state.global.currency)
  const {headerTitle, prevPage} = useSelector((state) => state.global)
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  }
  preferences.push({
    label: t(`global.language`),
    template: <div className="menuDropdown">
      <label className='mr-2' ><FontAwesomeIcon className="mr-1" icon={faLanguage} />{t(`global.language`)}</label>
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
  })
  if(user?.role != 'shelter')
    preferences.push({
      label: t(`global.currency`),
      template: <div className="menuDropdown">
        <label className='mr-2'><FontAwesomeIcon className="mr-1" icon={faCoins} />{t(`global.currency`)}</label>
        <Dropdown
          value={currency}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => dispatch(setCurrency(e.value))}
          options={[
            { label: 'USD', value: 'usd' },
            { label: 'COP', value: 'cop' },
          ]}
        />
      </div>
    })

  return <header className={'main_header '+header}>

    {user?.id &&
      <Nav />
    }

    <div className="navbar-item go-back">
      {user?.id && prevPage?.length > 1 &&
        <Link to={prevPage?.at(-2)}><FontAwesomeIcon icon={faChevronLeft} /></Link>
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
      <Link to="/" className="navbar-item logo">
        <img src="/assets/earth-day-group.png" alt="Earth Day Group" />
      </Link>
    }

    {['map'].some(s => s == header) && <div></div>}

    {user?.id && 
      <div className="navbar-item right-align icons">
        {!['settings'].some(s => s == header) && (user?.role == 'user' || user?.role == 'company') && <>
          {user?.role == 'user' && <>
            <Tooltip target=".cart" />
            <FontAwesomeIcon className="cart hide__mobile" data-pr-tooltip={tToolTip("cart")} data-pr-position="top" icon={faShoppingCart} />
          </>}
          <Tooltip target=".bookmarks" />
          <Link data-pr-tooltip={tToolTip("bookmarks")} data-pr-position="top" className="bookmarks hide__mobile" to="/bookmarks/products/saved/"><FontAwesomeIcon icon={faHeart} /></Link>
        </>}
        <div className="show__mobile">
          <Menu ref={menuMobile} className="mobileMenu" popup model={[
            {
              label: tToolTip("cart"),
              template: <><FontAwesomeIcon className="cart" icon={faShoppingCart} /> {tToolTip("cart")}</>
            },
            {
              label: tToolTip("bookmarks"),
              template: <Link className="bookmarks" to="/bookmarks/products/saved/"><FontAwesomeIcon icon={faHeart} /> {tToolTip("bookmarks")}</Link>
            },
            {
              label: tToolTip("notifications"),
              template: <Link className="p-overlay-badge" to={"/notifications/"}><FontAwesomeIcon className=' notifications' icon={faBell} /> {tToolTip("notifications")}</Link>
            },
            {
              label: tToolTip("logout"),
              template: <a className="logout" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /> {tToolTip("logout")}</a>
            },
          ]} />
          <Link className="config" onClick={(event) => menuMobile.current.toggle(event)}><FontAwesomeIcon icon={faBars} /></Link>
        </div>
        <HeaderNotifications />
        <div>
          <Menu ref={menu} popup style={{ width: 'auto', padding: '0.6rem' }} model={preferences} />
          <Tooltip target=".config" />
          <Link data-pr-tooltip={tToolTip("preferences")} data-pr-position="top" className="config hide__mobile" onClick={(event) => menu.current.toggle(event)}><FontAwesomeIcon icon={faSliders} /></Link>
        </div>
        <Tooltip target=".logout" />
        <a className="logout" data-pr-tooltip={tToolTip("logout")} data-pr-position="top" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></a>
      </div>
    }

    {!user?.id && 
      <div className="navbar-item right-align">
        {['login'].some(s => s != header) && 
              <Link className="button small dark-blue" to="/login/">{t(`global.login`)}</Link>
        }
        <button className="small" onClick={() => i18n.changeLanguage(i18n.language == 'es' ? 'en' : 'es')}>ES/EN</button>
      </div>
    }
  </header>
}

export default Header