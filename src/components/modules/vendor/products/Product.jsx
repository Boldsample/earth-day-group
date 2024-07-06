import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as faBookmarkLine } from "@fortawesome/free-regular-svg-icons"
import { faBookmark, faCartPlus, faImage, faTrash } from "@fortawesome/free-solid-svg-icons"

import Footer from "@ui/footer/Footer"
import { setHeader } from "@store/slices/globalSlice"
import { getProduct } from "@services/productServices"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileElements from "@ui/templates/ProfileListing/ProfileElements"

import "../../profile/profile.sass"

const Product = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ product, setProduct ] = useState(null)
  const user = useSelector((state) => state.users.userData)

  const doFollow = async e => {
    e.preventDefault()
    await followProduct({type: 'product', entity: id, follower: user?.id})
    getProductData()
  }
  const getProductData = async () => {
    const _product = await getProduct(id)
    setProduct(_product)
  }

  useEffect(() => {
    if(id)
      getProductData()
		dispatch(setHeader('user'))
  }, [id])

  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
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
              {user?.id != product?.user && <>
                <Link className="button dark-blue" onClick={doFollow}><FontAwesomeIcon icon={product?.followed ? faBookmark : faBookmarkLine} /></Link>
                <Link className="button green-earth"><FontAwesomeIcon icon={faCartPlus} /> <span>Add to cart</span></Link>
              </> || <>
                <Link to={`/product/${product?.id}/`} className="button dark-blue"><FontAwesomeIcon icon={faCartPlus} /> <span>Edit</span></Link>
                <Link className="button red-state"><FontAwesomeIcon icon={faTrash} /> <span>Delete</span></Link>
              </>}
            </div>
          </div>
        </div>
        {user?.id != product?.user && 
          <ProfileElements user={product?.user} same={user?.id == product?.user} related={true} />
        }
      </div>
    </div>
    <Footer />
  </>
}

export default Product