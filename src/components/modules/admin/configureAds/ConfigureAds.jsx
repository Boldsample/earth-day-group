import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import AdManager from './AdManager';
import "../styles.sass"
import adSpecs from "@json/adFormatSpecs.json"
import { useTranslation } from 'react-i18next'


const ConfigureAds = () => {
    const [tTitles] = useTranslation('translation', { keyPrefix: 'admin.configureAds' })
    const { t } = useTranslation();
    const headerBannerDialogContent = t('admin.configureAds.dialogContentheaderBanner', { returnObjects: true });
    const dashboardButtonBannerDialogContent = t('admin.configureAds.dialogContentdashboardButton', { returnObjects: true });

    const user = useSelector((state) => state.users.userData)
  
  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
          <div className="ads__container">
            <AdManager bannerTitle={tTitles('headerBanner.title')} bannerDescription={tTitles('headerBanner.bodyText')} type="headerBanner" adSpecs={headerBannerDialogContent}/>
            <AdManager bannerTitle={tTitles('dashboardButtonBanner.title')} bannerDescription={tTitles('dashboardButtonBanner.bodyText')} type="dashboardButton " adSpecs={dashboardButtonBannerDialogContent}/>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
