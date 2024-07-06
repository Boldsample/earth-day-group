import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import { getPet } from "@services/petServices"
import { setHeader } from "@store/slices/globalSlice"

import "../../profile/profile.sass"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileElements from "@ui/templates/ProfileListing/ProfileElements"
import { faBookmark, faCartPlus } from "@fortawesome/free-solid-svg-icons"
import { faBookmark as faBookmarkLine } from "@fortawesome/free-regular-svg-icons"

const Pet = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ pet, setPet ] = useState(null)
  const user = useSelector((state) => state.users.userData)

  const doFollow = async e => {
    e.preventDefault()
    await followPet({type: 'pets', entity: id, follower: user?.id})
    getPetData()
  }
  const getPetData = async () => {
    const _pet = await getPet(id)
    setPet(_pet)
  }

  useEffect(() => {
    if(id)
      getPetData()
		dispatch(setHeader('user'))
  }, [id])

  return <>
    <div className="layout autoheight">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <div className="profileInformation__grid">
          <div className="image__container">
            {pet?.images?.length > 0 && 
              <PhotoGallery type="min" imageCatalog={pet?.images} /> ||
              <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={null}/>
            }
          </div>
          <div className="profileInformation__container">
            <h2>{pet?.name}</h2>
            <p className="mt-2 mb-4">{pet?.description}</p>
            <h4 className="dark-blue">{parseInt(pet?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h4>
            <div className="buttons__container">
              <Link className="button dark-blue" onClick={doFollow}><FontAwesomeIcon icon={pet?.followed ? faBookmark : faBookmarkLine} /></Link>
              <Link className="button green-earth"><FontAwesomeIcon icon={faCartPlus} /> Add to cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProfileElements user={pet?.user} same={user?.id == pet?.user} related={true} />
    <div className="layout autoheight fullwidth pt-0">
      <Footer />
    </div>
  </>
}

export default Pet