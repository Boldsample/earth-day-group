import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton";
import "./styles.sass";
import Footer from "@ui/footer/Footer";
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto";

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
  
console.log(listing)

  const secondaryBannerData = [
    {
      title: "100%\nRecycled",
      icon: "/assets/icons/recycleCompanyIcon1.svg",
    },
    {
      title: "Eco\nFriendly",
      icon: "/assets/icons/recycleCompanyIcon2.svg",
    },
    {
      title: "Post\nOffer",
      icon: "/assets/icons/recycleCompanyIcon3.svg",
    },
  ];

  const backGroundImage = {
    background: content.bannerImage,
    backgroundSize: "cover"
  }

  return (
    <div className="layout">
      <div className="companies__banner" style={backGroundImage}>
        <h1 className="text-upperCase">{content.title}</h1>
      </div>
      <div className="secondary__banner">
        {secondaryBannerData.map((data) => {
          return (
            <div className="icon__container">
              <img src={data.icon} alt={data.title} />
              <h3>{data.title}</h3>
            </div>
          );
        })}
      </div>
      <div className="main__content dashboard-content fullwidth content__flex">
        <div className="search mb-1 search-lenght">
          <span className="p-input-icon-left">
            <FontAwesomeIcon icon={faSearch} />
            <InputText
              placeholder="Search Companies"
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
                  <div className="recycleCompanyCard__container">
                    <ProfilePhoto
                      className="recycleCompanyProfile__photo"
                      userPhoto={company.picture}
                      size="35px"
                    />
                    <div className="contactInformation__layout">
                      <div className="contactInformation__container">
                        <div className="proximity__container">
                          <span class="proximity__icon"></span>
                          <small>2,3miles away</small>
                        </div>
                        <h4>{company.name}</h4>
                        <p>{company.address}</p>
                      </div>
                      <Link
                        to={`/company/${company.id}`}
                        className="button dark-blue"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                );
              })
            : skeletonPlaceHolder.map(skeleton =>  <CardSkeleton/>)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryListing;
