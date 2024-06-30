import { useSelector } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons"

import Footer from "@ui/footer/Footer"
import { followUser } from "@services/userServices"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "./styles.sass"

const CategoryListing = ({content, elements, filters, reloadList = () => false, setFilters = () => false}) => {
  const location = useLocation()
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)

  const doFollow = async (id) => {
    await followUser({user: id, follower: user?.id})
    reloadList()
  }
  console.log(elements)

  return <>
    <div className="layout autoheight template__top">
      <div className="category__banner" style={{backgroundImage: content.bannerImage}}>
        <h1 className="text-upperCase">{content.title}</h1>
      </div>
      <div className="features">
        {content?.secondary?.map((data, key) => 
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
          <div className="p-input-icon-left fullwidth">
            <FontAwesomeIcon icon={faSearch} />
            <InputText
              placeholder={"Search"}
              value={filters.keyword}
              className="p-inputtext"
              onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))} />
            <Link onClick={reloadList()}><FontAwesomeIcon icon={faCircleChevronRight} /></Link>
          </div>
        </div>
        <div className="types">
          {content?.types.map((type, key) => <Link key={key} to={type?.url} className={location.pathname == type?.url ? 'active' : ''}>{type?.label}</Link>)}
        </div>
        <div className="categoryCards_grid">
          {elements?.data?.length > 0 ? 
            elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} />) : 
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