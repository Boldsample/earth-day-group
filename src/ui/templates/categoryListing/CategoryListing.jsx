import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Footer from "@ui/footer/Footer"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "./styles.sass";

const CategoryListing = ({content, category}) => {
  const [listing, setListing] = useState([]);
  const [filteredListing, setFilteredListing] = useState(listing);
  const skeletonPlaceHolder = ["", "", "", ""]

  const filteredListings = listing?.filter((category) =>
    category.name.toLowerCase().includes(filteredListing)
  );

  useEffect(() => {
    setListing(category)
  }, [category]);

  const secondaryBannerData = [
    {
      title: "100% Recycled",
      icon: "/assets/icons/recycleCompanyIcon1.svg",
    },
    {
      title: "Eco Friendly",
      icon: "/assets/icons/recycleCompanyIcon2.svg",
    },
    {
      title: "Sustainable Economy",
      icon: "/assets/icons/recycleCompanyIcon3.svg",
    },
  ];

  return <>
    <div className="layout autoheight template__top">
      <div className="category__banner" style={{backgroundImage: content.bannerImage}}>
        <h1 className="text-upperCase">{content.title}</h1>
      </div>
      <div className="features">
        {secondaryBannerData.map((data, key) => 
          <div key={key} className="icon">
            <img src={data.icon} alt={data.title} />
            <h4>{data.title}</h4>
          </div>
        )}
      </div>
    </div>
    <div className="layout autoheight category__listing">
      <div className="main__content fullwidth pt-6">
        <div className="search mb-1">
          {content.searchLabel && <h3 className="text-center mb-1">{content.searchLabel}</h3>}
          <span className="fullwidth p-input-icon-left">
            <FontAwesomeIcon icon={faSearch} />
            <InputText
              placeholder={"Search"}
              className="p-inputtext"
              onChange={(e) => setFilteredListing(e.target.value)}
            />
          </span>
        </div>
        <div className="recycleCompaniesCards__grid">
          {/* <CardSkeleton/> */}
          {filteredListings?.length > 0
            ? filteredListings.map((company, key) => {
                return (
                  <div key={key} className="recycleCompanyCard__container">
                    <ProfilePhoto
                      size="2.1875rem"
                      className="recycleCompanyProfile__photo"
                      userPhoto={company.picture}
                    />
                    <div className="contactInformation__layout">
                      <div className="contactInformation__container">
                        <div className="proximity__container">
                          <span className="proximity__icon"></span>
                          <small>2,3miles away</small>
                        </div>
                        <h4>{company.name}</h4>
                        <p>{company.address}</p>
                      </div>
                      <Link
                        to={`/${company.role}/${company.id}`}
                        className="button dark-blue"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                );
              })
            : skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)}
        </div>
      </div>
    </div>
    <div className="layout autoheight fullwidth pt-0">
      <Footer />
    </div>
  </>
}

export default CategoryListing