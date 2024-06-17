import React, { useState } from "react"
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import "./profile.sass"
import { Image } from "primereact/image"

const PhotoGallery = ({imageCatalog}) => {
  return <div className="photoGallery__container">
    <h2>Pictures</h2>
    {!imageCatalog?.length ? <p>You have not uploaded any images to your profile.</p> : 
      <Swiper
        spaceBetween={50}
        modules={[Navigation]}
        loop={imageCatalog?.length > 3}
        rewidn={imageCatalog?.length > 3}
        navigation={imageCatalog?.length > 3}
        centeredSlides={imageCatalog?.length > 3}
        className={'slides-' + imageCatalog?.length}
        slidesPerView={imageCatalog?.length > 3 ? 3 : imageCatalog?.length}>
          {imageCatalog?.map(image => 
            <SwiperSlide><Image src={image?.picture} preview /></SwiperSlide>
          )}
      </Swiper>
    }
  </div>
}

export default PhotoGallery