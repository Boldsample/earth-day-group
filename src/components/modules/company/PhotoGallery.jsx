import React from 'react'
import { Carousel } from 'primereact/carousel';
import companyImg from '../../../assets/testImg2.png'
const PhotoGallery = () => {

  const images = [
    companyImg, companyImg, companyImg
  ]

  const responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1199px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '575px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  const productTemplate = (image) => {
    return (
          <img src={image} alt={image}  />           
    );
};

  return (
    <div className='photoGallery__container'>
           <Carousel value={images} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
    </div>
  )
}

export default PhotoGallery