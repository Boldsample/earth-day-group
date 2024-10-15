import { Image } from "primereact/image"
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import "./profile.sass"

const PhotoGallery = ({imageCatalog, type = 'full'}) => {
  const [t] = useTranslation('translation', { keyPrefix: 'profile.photoGallery'})
  return type == 'full' && <div className="photoGallery__container">
    <h2 className={'slides-' + imageCatalog?.length}>{t('mainTitle')}</h2>
    {!imageCatalog?.length ? <p>{t('noImagesMessage')}</p> : 
      <Swiper
        spaceBetween={50}
        modules={[Navigation]}
        loop={imageCatalog?.length > 3}
        navigation={imageCatalog?.length > 3}
        centeredSlides={imageCatalog?.length > 3}
        className={'slides-' + imageCatalog?.length}
        slidesPerView={imageCatalog?.length > 3 ? 3 : imageCatalog?.length}>
          {imageCatalog?.map((image, key) => 
            <SwiperSlide key={key}><Image src={image?.picture} preview /></SwiperSlide>
          )}
      </Swiper>
    }
  </div> || 
  <Swiper
    loop={true}
    navigation={true}
    slidesPerView={1}
    className="minimal"
    centeredSlides={true}
    pagination={{ clickable: true }}
    modules={[Navigation,Pagination]} >
    {imageCatalog?.map((image, key) => 
      <SwiperSlide key={key}><Image src={image?.picture} preview /></SwiperSlide>
    )}
  </Swiper>
}

export default PhotoGallery