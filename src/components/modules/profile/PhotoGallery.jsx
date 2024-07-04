import { Image } from "primereact/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import "./profile.sass"

const PhotoGallery = ({imageCatalog, type = 'full'}) => {
  return type == 'full' && <div className="photoGallery__container">
    <h2 className={'slides-' + imageCatalog?.length}>Pictures</h2>
    {!imageCatalog?.length ? <p>You have not uploaded any images to your profile.</p> : 
      <Swiper
        spaceBetween={50}
        modules={[Navigation]}
        loop={imageCatalog?.length > 3}
        rewind={imageCatalog?.length > 3}
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
    rewind={true}
    slidesPerView={1}
    className="minimal"
    centeredSlides={true}
    modules={[Pagination]}
    pagination={{ clickable: true }} >
      {imageCatalog?.map((image, key) => 
        <SwiperSlide key={key}><Image src={image?.picture} preview /></SwiperSlide>
      )}
  </Swiper>
}

export default PhotoGallery