import React, { useState, useRef } from "react";
import { Carousel } from "primereact/carousel";
import companyImg from "../../../assets/testImg2.png";
import "./profile.sass";

const PhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [companyImg, companyImg, companyImg, companyImg];
  const imageElement = useRef(null);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  // function getIndex() {
  //   console.log(imageElement.current.getElement());
  // }

  const productTemplate = (image, index) => {
    const middleIndex = Math.floor(images.length / 2);
    const isMiddleImage = index === activeIndex || index === middleIndex;
    console.log(index, image);
    return (
      <div className={`image_container ${isMiddleImage ? "middle_image" : ""}`}>
        <img className="carousel__image" src={image} alt={image} />
      </div>
    );
  };

  return (
    <div className="photoGallery__container">
      <Carousel
        // ref={getIndex}
        value={images}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        // itemTemplate={productTemplate}
        itemTemplate={(image) => productTemplate(image, images.indexOf(image))}
        onPageChange={(e) => setActiveIndex(e.page)}
        page={activeIndex}
      />
    </div>
  );
};

export default PhotoGallery;
