import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faLocationDot, faHouse, faGlobe, faPen, faHeart } from "@fortawesome/free-solid-svg-icons"

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import './profile.sass'

const CompanyInformation = ({company, canEdit, doFollow}) => {

  return <div className='companyInformation__grid'>
    <div className="image__container">
      <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={company?.picture}/>
    </div>
    <div className="companyInformation__container">
      <h2>{company?.name}</h2>
      <div className="about__container">
        <h4>About the Organization</h4>
        <p>{company?.description}</p>
      </div>
      <ul className="contact__grid">               
        <li><FontAwesomeIcon icon={faPhone} className='contact__icon'/>{company?.phone}</li>
        <li><FontAwesomeIcon icon={faLocationDot}  className='contact__icon'/>{company?.address}</li>
        <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{company?.email}</li>
        <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> Pickup from home: {company?.pick_up_from_home == true ? "Available" : "Not Available"}</li>
      </ul>
      <div className="recycableGoods__container"> 
        <h4>Price for Recycable Goods</h4>
        <div className='materialsCard__grid'>
          {company?.materials?.length != 0 ?
            company?.materials?.map((material) => 
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
        <Link className="button green-earth" to={`/chat/${company?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /> Contact Us</Link>
        {canEdit && 
          <Link className="dark-blue" to="/settings/edit/"><FontAwesomeIcon icon={faPen} /> Edit Profile</Link> || 
          <Button className={company?.followed ? 'red-state' : 'dark-blue'} onClick={doFollow}><FontAwesomeIcon icon={faHeart} /> {company?.followed ? 'Unfollow' : 'Follow'}</Button>
        }
      </div>
    </div>
    </div>
  }
  
  export default CompanyInformation