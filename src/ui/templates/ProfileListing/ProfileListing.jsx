import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faPen, faPlus, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import Footer from "@ui/footer/Footer"
import ProfileElements from "./ProfileElements"
import { followUser } from "@services/userServices"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileInformation from "@components/modules/profile/ProfileInformation"
import { useTranslation } from 'react-i18next'
import { Message } from "primereact/message"

import "../styles.sass"
import AdBanner from "@ui/banners/AdBanner"
import materials from "@json/recyclableMaterials.json"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { Link } from "react-router-dom"
import InfoTooltip from "@ui/tooltip/InfoTooltip"

const ProfileListing = ({type, profile, reloadElements = () => false}) => {
  const user = useSelector((state) => state.users.userData)
  const [moreMaterials, setMoreMaterials] = useState(false)
  const [t] = useTranslation('translation', { keyPrefix: 'ui.templates.profileListing.profileListing'})
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const ngoTypes = [
    {
      id: 'products',
      label: t('productLabel'),
      url: user?.id == profile?.id ? '/profile/' : `/${profile?.role}/${profile?.username}/`,
    },
    {
      id: 'pets',
      label:  t('petLabel'),
      url: user?.id == profile?.id ? '/profile/pets/' : `/${profile?.role}/${profile?.username}/pets/`,
    },
  ]

  const doFollow = async id => {
    await followUser({user: id, follower: user?.id})
    reloadElements()
  }
  const showMaterials = () => {
    let hasMoreButton = false
    return <>
      {profile.materials?.length > 0 && 
        <div className={'materialsCard__grid ' + (moreMaterials ? 'show' : 'hide')}>
          {materials?.map(category => {
            const _categoryMaterials = profile?.materials?.filter(material => category?.items?.some(item => item?.label == material?.type))
            if(_categoryMaterials?.length > 1)
              hasMoreButton = true
            if(_categoryMaterials?.length > 0)
              return <div key={category?.label} className="materialCategory">
                <h6>{category?.label}</h6>
                {_categoryMaterials.map(material =>
                  <RecycleMaterialCard
                    key={material?.type}
                    unit={material?.unit}
                    price={material?.price}
                    material={material.type} />
                )}
              </div>
          })}
        </div>      
      }
      {hasMoreButton &&
        <a className="button dark-blue mt-1 width-20 small" onClick={() => setMoreMaterials(prev => !prev)}><FontAwesomeIcon icon={moreMaterials ? faEyeSlash : faEye} /> <span>{moreMaterials ? t('LessMaterials') : t('MoreMaterials')}</span></a>
      }
    </>
  }
console.log(profile?.materials)
  if(!profile?.role)
    return
  return <>
    <div className="layout hasfooter">
      <img className="layout__background hide__mobile" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} same={user?.id == profile?.id} doFollow={doFollow} admin={user?.role == 'admin'} />
        {(profile?.materials?.length > 0 || user?.id == profile?.id && user?.role == "admin " || user?.id == profile?.id && user?.role == "company "  ) && 
          <div className="recycableGoods__container">
            <div className={`${profile.materials?.length !== 0 && user?.id != profile?.id  ? 'flex-start' : ''} materialsBoxTitle`}>
              <h4 className="width-auto">{t('recyclableGoodsTitle')}</h4>
              {profile.materials?.length != 0 && user?.id != profile?.id &&
                <InfoTooltip toolTipMessage={tToolTip("priceForRecyclableGoodsToolTip")} delay={700} />
              }
              {(user?.id == profile?.id && profile.materials?.length > 0) &&
                <Link className="button dark-blue small" to="/settings/edit/materials/"><FontAwesomeIcon icon={faPen} /> <span>{t('editMaterials')}</span></Link>
              }
            </div>
            {profile.materials?.length == 0 &&
              <div className="flex-column aligncenter mt-5">
                <Message className="width-60" severity="info" text={t('noItemsCreatedMessage')} />
                <Link className="button green-earth mt-2" to="/settings/edit/materials/"><FontAwesomeIcon icon={faPlus} /> <span>{t('createFirstMaterial')}</span></Link>
              </div>
            }
            {showMaterials()}
          </div>
        }
        <AdBanner type="headerBanner" />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
        {profile?.role != 'company' && 
          <ProfileElements type={type} entity={profile?.id} user={profile?.id} same={user?.id == profile?.id} types={profile?.role == 'ngo' ? ngoTypes : null} />
        }
      </div>
    </div>
    <Footer />
  </>
}

export default ProfileListing