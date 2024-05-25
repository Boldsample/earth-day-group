import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from 'primereact/button'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone, faLocationDot, faHouse, faGlobe } from "@fortawesome/free-solid-svg-icons"
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import { getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import ListingProfile from "@ui/templates/listingProfile/ListingProfile"
import "./profile.sass"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  
  const getProfileData = async () => {
    const _profile = await getUser(id)
    setProfile(_profile)
  }

  useEffect(() => {
    if(id)
      getProfileData()
    else
      setProfile(user)
		dispatch(setHeader('user'))
  }, [])

  return <ListingProfile profile={profile}>
    <h2>{profile?.name}</h2>
      <div className="about__container">
        <h4>About the Organization</h4>
        <p>{profile?.description}</p>
      </div>
      <ul className="contact__grid">               
        <li><FontAwesomeIcon icon={faPhone} className='contact__icon'/>{profile?.phone}</li>
        <li><FontAwesomeIcon icon={faLocationDot}  className='contact__icon'/>{profile?.address}</li>
        <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.email}</li>
        <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> Pickup from home: {profile?.pick_up_from_home == true ? "Available" : "Not Available"}</li>
      </ul>
      <div className="recycableGoods__container"> 
        <h4>Price for Recycable Goods</h4>
        <div className='materialsCard__grid'>
          {profile?.materials?.length != 0 ?
            profile?.materials?.map((material) => 
              <RecycleMaterialCard
                key={material.id}
                material={material.type}
                unit={material.unit}
                price={material.price}
                color={material.color} />
            ) : 
            <p>You have not uploaded any materials.</p>
          }
        </div>
      </div>
      <div className="buttons__container">
        <Button label='Contact Us' icon={(options) => <FontAwesomeIcon icon={faWhatsapp}  {...options.iconProps} />} className="green-earth" />
        {!id ? 
          <Button label='Edit Profile' className="dark-blue" /> :
          <Button label='Follow' className="dark-blue" />
        }
      </div>
  </ListingProfile>
}

export default Profile