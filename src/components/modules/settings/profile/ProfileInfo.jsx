import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { faHeart, faPerson, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { formatExternalURL } from '@utils/formatExternalURL'
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import "../styles.sass"

const ProfileInfo = ({user, doFollow = () => false, same = false, type = 'settings'}) => {

  const userData = () => {
    switch (user?.role) {
      case 'company':
        return [
          { key: 'Phone Number', value: user?.phone },
          { key: 'NIT', value: user?.nit },
          { key: 'Website', value: <a href={formatExternalURL(user?.website)} target="_blank">{user?.website}</a> },
          { key: 'Address', value: user?.address }
        ]
      default:
        return [
          { key: 'Phone Number', value: user?.phone },
          { key: 'Address', value: user?.address }
        ]
    }
  }
  
  return <>
    <div className="settings__card">
      <ProfilePhoto className="mb-1" userPhoto={user?.picture} />
      <h4 className="font-bold text-gray">{user?.name}</h4>
      <p>{user?.email}</p>
      {user?.role == 'user' && <p className="mb-2">{user?.description}</p>}
      {same && <>
        <div className="followers">
          <Link to="/followers/">
            <span>{user?.followers}</span>
            Followers
          </Link>
          <Link to="/following/">
            <span>{user?.following}</span>
            Following
          </Link>
        </div>
        <Link to={'/settings/edit/'} className="button dark-blue">Edit</Link>
      </> || <>
        {user?.role != 'user' && 
          <Link className="button light-green" to={`/${user?.role}/${user?.username}/`}><FontAwesomeIcon icon={faUser} /> View profile</Link>
        }
        <Button className={user?.followed ? 'red-state' : 'dark-blue'} onClick={doFollow}><FontAwesomeIcon icon={faHeart} /> {user?.followed ? 'Unfollow' : 'Follow'}</Button>
        {type != 'chat' && 
          <Link to={`/chat/${user?.username}/`} className="button green-earth"><FontAwesomeIcon icon={faPaperPlane} /> Send a message</Link>
        }
      </>}
    </div>
    {(same || user?.role == 'company') && 
      <div className="settings__card">
        {userData().map((data, key) => <div key={key} className="settings__table">
          <h4 className="internal">{data.key}</h4>
          <p>{data.value}</p>
        </div>)}
      </div>
    }
    {user?.role == 'company' && <>
      <div className="settings__card">
        <h4 className="internal mb-1">About Organization</h4>
        <p className="small mb-1">{user?.description}</p>
      </div>
      <div className="settings__card">
        <div className="settings__table">
          <h4 className="internal">Pickup at Home</h4>
          <p>{user?.pick_up_from_home ? 'Available' : 'Unavailable'}</p>
        </div>
        {user?.images?.length > 0 && <>
          <h4 className="internal text-left">Gallery</h4>
          <div className="gallery mb-2">
            {user.images.map(image => 
              <img key={image.id} src={image.picture} />
            )}
          </div>
        </>}
        {user?.materials?.length > 0 && <>
          <h4 className="internal text-left">Material Price</h4>
          <div className="materials">
            {user.materials.map(material => 
              <RecycleMaterialCard
                key={material.id}
                material={material.type}
                unit={material.unit}
                price={material.price}
                color={material.color} />
            )}
          </div>
        </>}
      </div>
    </>}
  </>
}
export default ProfileInfo