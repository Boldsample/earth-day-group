import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as faBookmarkLine, faHeart as faHeartLine } from "@fortawesome/free-regular-svg-icons"
import { faBookmark, faCartPlus, faFlag, faImage, faTrash, faHeart } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'
import { Message } from "primereact/message"

import Footer from "@ui/footer/Footer"
import { setHeader } from "@store/slices/globalSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { useNotifications } from "@components/WebSocket"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import { followProduct, getProduct, updateProduct } from "@services/productServices"
import ProfileElements from "@ui/templates/ProfileListing/ProfileElements"

import "../../profile/profile.sass"
import { Tooltip } from "primereact/tooltip"
import AdBanner from "@ui/banners/AdBanner"
import { Chip } from "primereact/chip"
import ConfirmationModal from "@ui/modals/ConfirmationModal"

const Product = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [ product, setProduct ] = useState(null)
  const [ confirm, setConfirm ] = useState(null)
  const { sendNotificationMessage } = useNotifications()
  const user = useSelector((state) => state.users.userData)
  const [tGlobal] = useTranslation('translation', { keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'vendor.products.product'})

  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updateProduct({state: 2}, {id: id})
      if(user.role != 'admin')
        navigate('/profile/')
      else
        setProduct(null)
    }
  }
  const doFollow = async e => {
    e.preventDefault()
    await followProduct({type: 'product', entity: id, follower: user?.id, userID: product?.userid}, sendNotificationMessage)
    getProductData()
  }
  const getProductData = async () => {
    const _product = await getProduct(id, user?.id)
    if(user?.role != 'admin' && _product?.state == 2)
      navigate('/profile/')
    else
      setProduct(_product)
  }

  useEffect(() => {
    setProduct(null)
    dispatch(setHeader('user'))
  }, [id])
  useEffect(() => {
    if(id && product == null)
      getProductData()
  }, [product])

  return <>
    <ConfirmationModal title={user?.role == "admin" ? t('disableProductTitle') : t('deleteProductTitle')} visible={confirm} action={changeState} type={user?.role}  />
    <div className="layout hasfooter">
      <img className="layout__background hide__mobile" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <div className="profileInformation__grid">
          <div className="image__container">
            {product?.images?.length > 0 && 
              <PhotoGallery type="min" imageCatalog={product?.images} /> ||
              <ProfilePhoto className="profile__photo-large" size="12.5rem" icon={faImage}/>
            }
          </div>
          <div className="profileInformation__container">
            <h2>{product?.name}</h2>
            <p className="mt-2 mb-4">{product?.description}</p>
            <h4 className="dark-blue">{parseInt(product?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h4>
            <div className="buttons__container">
              {user?.id != product?.user && user?.role != 'admin' && <>
                <Link className="button small dark-blue" onClick={doFollow}><FontAwesomeIcon icon={product?.followed ? faHeart : faHeartLine} /></Link>
                <Link className="button small green-earth"><FontAwesomeIcon icon={faCartPlus} /> <span>{t('addToCartBtnText')}</span></Link>
                <Link className="button small red-state outline hasTooltip" to={`/report/product/${product?.id}/`} data-pr-tooltip={t('reportProductTooltipText')}><FontAwesomeIcon icon={faFlag} /></Link>
              </> || <>
                <Link to={`/product/edit/${product?.id}/`} className="button small dark-blue"><FontAwesomeIcon icon={faCartPlus} /> <span>{t('editProductBtnText')}</span></Link>
                {product?.state == 1 && 
                  <button onClick={() => setConfirm(true)} className="button small red-state"><FontAwesomeIcon icon={faTrash} /> <span>{user?.role == "admin" ? t('disableProductBtn') : t('deleteProductBtn')}</span></button>
                || 
                  // <Chip className="background-red-state ml-1" label={tGlobal('deleted')} />
                  <div className="mt-2">
                  <Message severity="error" text={t('deletedProductWarningMessage')} />
                </div>
                }
              </>}
            </div>
          </div>
        </div>
        <AdBanner type="headerBanner"/>
        {user?.id != product?.user && user?.role != 'admin' && 
          <ProfileElements user={product?.user} entity={product?.id} same={user?.id == product?.user} related={true} />
        }
      </div>
    </div>
    <Footer />
    <Tooltip target=".hasTooltip" position="top" />
  </>
}

export default Product