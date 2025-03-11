import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faTiktok, faFacebook, faXTwitter } from "@fortawesome/free-brands-svg-icons"

import './footer.sass'

const Footer = () => {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'global'})

  return (
    <div className='footer__grid'>
      <Link to="/"><img src="/assets/earth-day-group.png" alt="Earth Day Group" /></Link>
      <p className='contactInfo__text'>Earth Day Group LLC<br />info@earthdaygroup.com</p>
      <div>
        <div className="mb-1">{t('adWithUs')}</div>
        <a className="button small dark-blue" href={`mailto:info@earthdaygroup.com?subject=${encodeURIComponent(t('adSubject'))}&body=${encodeURIComponent(t('adSubject'))}`}>{t('contact')}</a>
      </div>
      <div className="socialMedia__container">
          <Link to={i18n.language == 'es' ? 'https://www.instagram.com/earthdaygroup' : 'https://www.instagram.com/earthdaygroup_usa'} target="_blank"><FontAwesomeIcon icon={faInstagram} className='footer__icon'/></Link>
          <Link to="https://www.facebook.com/earthdaygroup" target="_blank"><FontAwesomeIcon icon={faFacebook} className='footer__icon'/></Link>
          <Link to="https://www.tiktok.com/@earthdaygroup" target="_blank"><FontAwesomeIcon icon={faTiktok} className='footer__icon'/></Link>
          <Link to="https://x.com/EarthDayGroup2" target="_blank"><FontAwesomeIcon icon={faXTwitter} className='footer__icon'/></Link>
      </div>
    </div>
  )
}

export default Footer