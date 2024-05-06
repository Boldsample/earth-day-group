import React, { useState, useRef } from "react";
import { Carousel } from "primereact/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./profile.sass";

const PhotoGallery = ({imageCatalog}) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
    return <img className="carousel__image" src={image?.data} alt={image} />;
  };

  return (
    <div className="photoGallery__container">
      <h2>Pictures</h2>
      {imageCatalog == null ? <p>You have not uploaded any images to your profile.</p> : 
        <Carousel
        prevIcon={(options) => (
          <FontAwesomeIcon icon={faChevronLeft} {...options.iconProps} />
        )}
        nextIcon={(options) => (
          <FontAwesomeIcon icon={faChevronRight} {...options.iconProps} />
        )}
        value={imageCatalog}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        onPageChange={(e) => setActiveIndex(e.page)}
        page={activeIndex}
        showIndicators={false}
      />
      }
      
    </div>
  );
};

export default PhotoGallery;
