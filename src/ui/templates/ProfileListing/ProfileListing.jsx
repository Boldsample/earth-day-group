import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import ProfileElements from "./ProfileElements"
import { followUser } from "@services/userServices"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileInformation from "@components/modules/profile/ProfileInformation"
import { useTranslation } from 'react-i18next'


import "../styles.sass"
import AdBanner from "@ui/banners/AdBanner"
import materials from "@json/recyclableMaterials.json"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"

const ProfileListing = ({type, profile, reloadElements = () => false}) => {
  const user = useSelector((state) => state.users.userData)
  const [moreMaterials, setMoreMaterials] = useState(false)
  const [t] = useTranslation('translation', { keyPrefix: 'ui.templates.profileListing.profileListing'})

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

  const doFollow = id => {
    followUser({user: id, follower: user?.id})
    reloadElements()
  }

  if(!profile?.role)
    return
  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} same={user?.id == profile?.id} doFollow={doFollow} admin={user?.role == 'admin'} />
        {profile?.materials?.length > 0 && 
        <div className="recycableGoods__container"> 
          <h4>{t('recyclableGoodsTitle')}</h4>
          <div className={'materialsCard__grid ' + (moreMaterials ? 'show' : 'hide')}>
            {materials?.map(category => {
              const _categoryMaterials = profile?.materials?.filter(material => category?.items?.some(item => item?.label == material?.type))
              if(_categoryMaterials?.length > 0)
                return <div className="materialCategory">
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
          <a onClick={() => setMoreMaterials(prev => !prev)}>{moreMaterials ? t('LessMaterials') : t('MoreMaterials')}</a>
        </div>
        }
        <AdBanner type="headerBanner"/>
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
        {profile?.role != 'company' && 
          <ProfileElements type={type} user={profile?.id} same={user?.id == profile?.id} types={profile?.role == 'ngo' ? ngoTypes : null} />
        }
      </div>
    </div>
    <Footer />
  </>
}

export default ProfileListing