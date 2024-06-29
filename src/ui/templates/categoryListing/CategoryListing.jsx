import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Footer from "@ui/footer/Footer"
import { followUser } from "@services/userServices"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "./styles.sass";

const CategoryListing = ({content, category, reloadList = () => false}) => {
  const [listing, setListing] = useState([]);
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)
  const [filteredListing, setFilteredListing] = useState(listing);

  const doFollow = async (id) => {
    await followUser({user: id, follower: user?.id})
    reloadList()
  }
  const filteredListings = listing?.filter((category) =>
    category.name.toLowerCase().includes(filteredListing)
  );

  useEffect(() => {
    setListing(category?.data)
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
        <div className="categoryCards_grid">
          {/* <CardSkeleton/> */}
          {filteredListings?.length > 0 ? 
            filteredListings.map(company => <MultiUseCard key={company.id} type="company" data={company} action={doFollow} />) : 
            skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
          }
        </div>
      </div>
    </div>
    <div className="layout autoheight fullwidth pt-0">
      <Footer />
    </div>
  </>
}

export default CategoryListing