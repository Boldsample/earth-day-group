import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons"

import Footer from "@ui/footer/Footer"
import { followUser } from "@services/userServices"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "../styles.sass"
import { followProduct } from "@services/productServices"

const CategoryListing = ({content, section, elements, filters, reloadElements = () => false, setFilters = () => false, page, setPage = () => false}) => {
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)

  const doFollow = async (id) => {
    if(elements?.card == 'product')
      await followUser({user: id, follower: user?.id})
    else
      await followProduct({type: 'product', entity: id, follower: user?.id})
    reloadElements()
  }

  return <>
    <div className="layout autoheight template__top">
      <div className="template__banner" style={{backgroundImage: content.bannerImage}}>
        <h1 className="text-upperCase">{content.title}</h1>
      </div>
      {content?.secondary?.length > 0 && 
        <div className="features">
          {content?.secondary?.map((data, key) => 
            <div key={key} className="icon">
              <img src={data.icon} alt={data.title} />
              <h4>{data.title}</h4>
            </div>
          )}
        </div>
      }
    </div>
    <div className="layout autoheight template__listing">
      <div className="main__content fullwidth pt-6">
        <div className="search mb-1">
          {content.searchLabel && <h3 className="text-center mb-1">{content.searchLabel}</h3>}
          <form onSubmit={reloadElements} className="p-input-icon-left fullwidth">
            <FontAwesomeIcon icon={faSearch} />
            <InputText
              placeholder={"Search"}
              value={filters.keyword}
              className="p-inputtext"
              onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))} />
            <Link type="submit"><FontAwesomeIcon icon={faCircleChevronRight} /></Link>
          </form>
        </div>
        <div className="types">
          {content?.types?.map((type, key) => <Link key={key} to={type?.url} className={section == type?.id ? 'active' : ''}>{type?.label}</Link>)}
        </div>
        <div className="templateCards_grid">
          {elements?.data?.length > 0 && 
            elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} />) 
          || (elements?.total == 0 &&
            <div className="fullwidth text-center">No {elements?.card} found.</div>
          ) || 
            skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
          }
          <Paginator first={page?.page} rows={page?.rows} totalRecords={elements?.total} onPageChange={e => setPage({page: e.first, rows: e.rows})} />
        </div>
      </div>
    </div>
    <div className="layout autoheight fullwidth pt-0">
      <Footer />
    </div>
  </>
}

export default CategoryListing