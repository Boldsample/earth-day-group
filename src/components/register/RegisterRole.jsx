import { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Card from "@ui/cards/Card"
import userRoles from '@json/roles.json'
import { setHeader } from '@store/slices/globalSlice'

const RegisterRole = () => {
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerRole'})
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setHeader('register'))
  }, [])
  
  return <div id="registerRole" className="layout">
    <img className="layout__background" src="/assets/register/image-1.svg" />
    <div className="main__content absoluteleft width58">
      <h2 className="text-center mb-3">{t('mainTitleText')}</h2>
      <div className="card__grid">
        {userRoles.length > 0 ? userRoles.map((role, key) => 
          <Link key={key} to={role.link}>
            <Card
              icon={role.icon}
              title={t(`${role.title}`)}
              cardStyle={role.className}
              description={t(`${role.description}`)}
            />
          </Link>)
        : "We couldn't find what you are looking for. Care to try again."}
      </div>
    </div>
  </div>
}

export default RegisterRole