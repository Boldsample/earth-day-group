import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"

import Footer from "@ui/footer/Footer"
import { followProduct } from "@services/productServices"
import { followUserData } from "@store/slices/usersSlice"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "../styles.sass"

const CategoryListing = ({content, section, elements, filters, reloadElements = () => false, setFilters = () => false, setReset = () => false, page, setPage = () => false}) => {
  const dispatch = useDispatch()
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)

  const doFollow = async id => {
    if(elements?.card == 'product' || elements?.card == 'pet'){
      await followProduct({type: elements?.card, entity: id, follower: user?.id})
      reloadElements()
    }else
      dispatch(followUserData({user: id, follower: user?.id}))
  }
  
  useEffect(() => {
    reloadElements()
  }, [user])

  return <>
    <div className="layout fullwidth hasfooter">
      <div className="template__top fullwidth">
        <div className="template__banner" style={{backgroundImage: content.bannerImage}}>
          <h1 className="text-upperCase">{content.title}</h1>
        </div>
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
      <div className="layout autoheight">
        <div className="main__content centerfullwidth pt-8">
          <div className="template__listing self-center">
            <div className="edg-search mb-1">
              {content.searchLabel && <h3 className="text-center mb-1">{content.searchLabel}</h3>}
              <form onSubmit={reloadElements} className="p-input-icon-left fullwidth">
                <FontAwesomeIcon icon={faSearch} />
                <InputText
                  placeholder={"Search"}
                  value={filters.keyword}
                  className="p-inputtext"
                  onChange={e => setFilters(prev => ({...prev, keyword: e.target.value}))} />
                {filters?.keyword && 
                  <Link className="reset" onClick={() => { setReset(true); setFilters({keyword: ''}) }}><FontAwesomeIcon icon={faTimes} /></Link>
                }
                <Link onClick={reloadElements}><FontAwesomeIcon icon={faCircleChevronRight} /></Link>
              </form>
            </div>
            <div className="types">
              {content?.types?.map((type, key) => <Link key={key} to={type?.url} className={section == type?.id ? 'active' : ''}>{type?.label}</Link>)}
            </div>
            <div className={`templateCards_grid cards-${elements?.data?.length}`}>
              {typeof elements?.total == 'undefined' && elements?.data?.length == 0 && 
                skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
              || (elements?.total > 0 && 
                elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} />)
              ) ||
                <div className="fullwidth text-center mt-2">
                  <p>We couldn't find what you are looking for. Care to try again.</p>
                </div>
              }
              {page?.rows < elements?.total && 
                <Paginator first={page?.page} rows={page?.rows} totalRecords={elements.total} onPageChange={e => setPage({page: e.first, rows: e.rows})} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
}

export default CategoryListing