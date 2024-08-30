import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import AdManager from './AdManager';
import "../styles.sass"
import adSpecs from "@json/adFormatSpecs.json"
import { useTranslation } from 'react-i18next'


const ConfigureAds = () => {
    const [t, i18next] = useTranslation('translation', { keyPrefix: 'admin.configureAds' })

    const user = useSelector((state) => state.users.userData)

  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
          <div className="ads__container">
            <AdManager bannerTitle={t('headerBanner.title')} bannerDescription={t('headerBanner.bodyText')} type="headerBanner" adSpecs={adSpecs.headerBanner}/>
            <AdManager bannerTitle={t('dashboardButtonBanner.title')} bannerDescription={t('dashboardButtonBanner.bodyText')} type="dashboardButton " adSpecs={adSpecs.dashboardButton}/>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
