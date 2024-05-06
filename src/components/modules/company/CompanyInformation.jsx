import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone, faLocationDot, faHouse, faGlobe, faComments } from "@fortawesome/free-solid-svg-icons"
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'
import { Button } from 'primereact/button'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto';
import companyImg from '../../../assets/testImg2.png'
import './profile.sass'

const CompanyInformation = ({company}) => {
    console.log(company.materials)
  return (
    <div className='companyInformation__grid'>
        <div className="image__container">
            {/* <img src={companyImg} alt="Company Image" /> */}
            <ProfilePhoto className="profile__photo-large" size="75px"/>
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
                <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{company.email}</li>
                <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> Pickup from home: {company?.pick_up_from_home == true ? "Available" : "Not Available"}</li>
            </ul>
            <div className="recycableGoods__container"> 
                <h4>Price for Recycable Goods</h4>
                <div className='materialsCard__grid'>
                    {company?.materials.length != 0 ?
                        company?.materials.map((material) => {
                            return <RecycleMaterialCard
                            key={material.id}
                            material={material.type}
                            unit={material.unit}
                            price={material.price}
                            color={material.color}
                        />
                        })                   
                     : <p>You have not uploaded any materials.</p>}
                </div>
            </div>
            <div className="buttons__container">
                <Button
                    label='Contact Us'
                    icon={(options) => <FontAwesomeIcon icon={faComments}  {...options.iconProps} />}
                    className="green-earth"
                />
                <Button
                    label='Edit Profile'
                    className="dark-blue"
                />
            </div>
        </div>
    </div>
  )
}

export default CompanyInformation