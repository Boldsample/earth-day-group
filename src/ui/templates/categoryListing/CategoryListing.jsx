import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faCircleChevronRight, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'

import Footer from "@ui/footer/Footer"
import { followProduct } from "@services/productServices"
import { followUserData } from "@store/slices/usersSlice"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "../styles.sass"
import AdBanner from "@ui/banners/AdBanner"

const CategoryListing = ({content, section, elements, filters, reloadElements = () => false, setFilters = () => false, setReset = () => false, page, setPage = () => false}) => {
  const dispatch = useDispatch()
  const bannerScroll = useRef(null)
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'ui.templates.categoryListing'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})

  const doFollow = async id => {
    if(elements?.card == 'product' || elements?.card == 'pet'){
      await followProduct({type: elements?.card, entity: id, follower: user?.id})
      reloadElements()
    }else
      dispatch(followUserData({user: id, follower: user?.id}))
  }
  const doScroll = (e) => {
  e.preventDefault()
  window.scrollTo({
    behavior: 'smooth',
    top: bannerScroll.current.offsetTop,
  })
  }
  
  useEffect(() => {
    if(filters?.keyword == '')
      reloadElements()
  }, [user, filters])

  return <>
    <div className="layout fullwidth hasfooter">
      <div className="template__top fullwidth">
        <div className="template__banner" style={{backgroundImage: content.bannerImage}}>
          <h1 className="text-upperCase">{content.title}</h1>
      <a className="scroll" href="#" onClick={doScroll}><FontAwesomeIcon icon={faChevronDown} /></a>
        </div>
      </div>
      {content?.secondary?.length > 0 && 
        <div ref={bannerScroll} className="features">
          {content?.secondary?.map((data, key) => 
            <div key={key} className="icon">
              <img src={data.icon} alt={data.title} />
              <h4>{data.title}</h4>
            </div>
          )}
        </div>
      }
      <div ref={content?.secondary?.length == 0 ? bannerScroll : null} className="layout autoheight">
        <div className="main__content centerfullwidth pt-4">
          <div className="template__listing self-center">
            <AdBanner type="headerBanner" />
            <div className="edg-search mb-1">
              {content.searchLabel && <h3 className="text-center mb-1">{content.searchLabel}</h3>}
              <form onSubmit={reloadElements} className="p-input-icon-left fullwidth">
                <FontAwesomeIcon icon={faSearch} />
                <InputText
                  placeholder={tGlobal('inputSearchPlaceHolder')}
                  value={filters.keyword}
                  className="p-inputtext"
                  onChange={e => {
                    setFilters(prev => ({...prev, keyword: e.target.value}))
                    if(e.target.value == '')
                      reloadElements()
                  }} />
                {filters?.keyword && 
                  <Link className="reset" onClick={() => { setFilters({keyword: ''}); }}><FontAwesomeIcon icon={faTimes} /></Link>
                }
                <button className="green-earth ml-1" onClick={reloadElements}>{t('search')}</button>
              </form>
            </div>
            <div className="types">
              {content?.types?.map((type, key) => <Link key={key} to={type?.url} className={section == type?.id ? 'active' : ''}>{type?.label}</Link>)}
            </div>
            <div className={`templateCards_grid cards-${elements?.data?.length}`}>
              {typeof elements?.total == 'undefined' && elements?.data?.length == 0 && 
                skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
              || (elements?.total > 0 && 
                elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} bookmark={user?.role != 'admin' && element?.user != user?.id} />)
              ) ||
                <div className="fullwidth text-center mt-2">
                  <p>{tGlobal('notfoundErrorMessage')}</p>
                </div>
              }
              {page?.rows < elements?.total && 
                <Paginator first={page?.first} page={page?.page} rows={page?.rows} totalRecords={elements.total} onPageChange={e => setPage({first: e.first, page: e.page, rows: e.rows})} />
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