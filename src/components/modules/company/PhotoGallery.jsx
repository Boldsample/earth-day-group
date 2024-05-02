import React, { useState, useRef } from "react";
import { Carousel } from "primereact/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import companyImg from "../../../assets/testImg2.png";
import "./profile.sass";

const PhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [companyImg, companyImg, companyImg, companyImg];

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


  const productTemplate = (image) => {
    return (
      <div className="image_container">
        <img className="carousel__image" src={image} alt={image} />
      </div>
    );
  };

  return (
    <div className="photoGallery__container">
       <h2>Pictures</h2>
      <Carousel
       prevIcon={(options) => <FontAwesomeIcon icon={faChevronLeft}  {...options.iconProps} />}
       nextIcon={(options) => <FontAwesomeIcon icon={faChevronRight}  {...options.iconProps} />}
        value={images}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        onPageChange={(e) => setActiveIndex(e.page)}
        page={activeIndex}
      />
    </div>
  );
};

export default PhotoGallery;
