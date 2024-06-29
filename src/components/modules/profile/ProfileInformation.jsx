import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faLocationDot, faHouse, faGlobe, faPen, faHeart, faEnvelope } from "@fortawesome/free-solid-svg-icons"

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import './profile.sass'

const ProfileInformation = ({profile, canEdit, doFollow}) => {
  return <div className='profileInformation__grid'>
    <div className="image__container">
      <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={profile?.picture}/>
    </div>
    <div className="profileInformation__container">
      <h2>{profile?.name}</h2>
      <p className="mt-2 mb-4">{profile?.description}</p>
      <ul className="contact__grid">
        {profile?.email && 
          <li><FontAwesomeIcon icon={faPhone} className='contact__icon'/>{profile?.phone}</li>
        }
        {profile?.email && 
          <li><FontAwesomeIcon icon={faEnvelope}  className='contact__icon'/>{profile?.email}</li>
        }
        {profile?.website && 
          <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.website}</li>
        }
        {profile?.gender && 
          <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.gender}</li>
        }
        {profile?.weight && 
          <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.weight}</li>
        }
        {profile?.ngo && 
          <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.ngo}</li>
        }
        {profile?.role == 'company' && 
          <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> Pickup from home: {profile?.pick_up_from_home == true ? "Available" : "Not Available"}</li>
        }
      </ul>
      {profile?.materials?.length > 0 && 
        <div className="recycableGoods__container"> 
          <h4>Price for Recycable Goods</h4>
          <div className='materialsCard__grid'>
            {profile?.materials?.map((material) => 
              <RecycleMaterialCard
                key={material.id}
                material={material.type}
                unit={material.unit}
                price={material.price}
                color={material.color} />
            )}
          </div>
        </div>
      }
      <div className="buttons__container">
        <Link className="button green-earth" to={`/chat/${profile?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /> <span>Contact Us</span></Link>
        {canEdit && <>
          <Link className="button dark-blue" to="/settings/edit/"><FontAwesomeIcon icon={faPen} /> <span>Edit Profile</span></Link>
        </> || 
          <Button className={profile?.followed ? 'red-state' : 'dark-blue'} onClick={doFollow}><FontAwesomeIcon icon={faHeart} /> <span>{profile?.followed ? 'Unfollow' : 'Follow'}</span></Button>
        }
      </div>
    </div>
  </div>
}

export default ProfileInformation