import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form"
import { Dialog } from 'primereact/dialog';
import ContentBox from '@ui/cards/contentBox/ContentBox';
import AdManager from './AdManager';
import "../styles.sass"

const ConfigureAds = () => {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.users.userData)
    const [bannerImg, setBannerImg] = useState(null)
    

  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
          <div className="ads__container">
            <AdManager type="headerBanner"/>
            <AdManager type="dashboardButton"/>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
