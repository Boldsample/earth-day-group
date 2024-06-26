import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import { setHeader } from "@store/slices/globalSlice"
import { getProduct } from "@services/productServices"

import "../../profile/profile.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faPaperPlane, faPen } from "@fortawesome/free-solid-svg-icons"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import { ListProducts } from ".."

const Product = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ product, setProduct ] = useState(null)
  const user = useSelector((state) => state.users.userData)

  const getProductData = async () => {
    const _product = await getProduct(id)
    setProduct(_product)
  }

  useEffect(() => {
    if(id)
      getProductData()
		dispatch(setHeader('user'))
  }, [id])

  console.log(product)

  return <>
    <div className="layout widthfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <div className="profileInformation__grid">
          <div className="image__container">
            {product?.pictures?.length > 0 && 
              <PhotoGallery type="min" imageCatalog={product?.pictures} /> ||
              <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={null}/>
            }
          </div>
          <div className="profileInformation__container">
            <h2>{product?.name}</h2>
            <p className="mt-2 mb-4">{product?.description}</p>
            <div className="buttons__container">
              {/* <Link className="button green-earth" to={`/chat/${product?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /> Contact Us</Link>
              <Link className="button dark-blue" to="/settings/edit/"><FontAwesomeIcon icon={faPen} /> Edit Profile</Link> || 
              <Button className={product?.followed ? 'red-state' : 'dark-blue'} onClick={doFollow}><FontAwesomeIcon icon={faHeart} /> {product?.followed ? 'Unfollow' : 'Follow'}</Button> */}
            </div>
          </div>
        </div>
        <ListProducts id={product?.userid} />
      </div>
    </div>
    <Footer />
  </>
}

export default Product