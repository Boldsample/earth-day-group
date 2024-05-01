import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone, faLocationDot, faHouse, faGlobe, faComments } from "@fortawesome/free-solid-svg-icons"
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'
import { Button } from 'primereact/button'
import companyImg from '../../../assets/testImg2.png'
import './profile.sass'

const CompanyInformation = () => {
  return (
    <div className='companyInformation__grid'>
        <div className="image__container">
            <img src={companyImg} alt="Company Image" />
        </div>
        <div className="companyInformation__container">
            <h2>Paper Recycle</h2>
            <div className="about__container">
                <h4>About the Organization</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis impedit ex cum quos! Quasi officiis accusantium quam voluptates, soluta a natus, commodi sint quis nobis tenetur repellat minima, veniam laudantium.</p>
            </div>
            <ul className="contact__grid">               
                <li><FontAwesomeIcon icon={faPhone} className='contact__icon'/> +56 243 55 43</li>
                <li><FontAwesomeIcon icon={faLocationDot}  className='contact__icon'/> Carrera 24D Oeste # 4-176</li>
                <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/> www.paperrecycle.com</li>
                <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> Pickup from home: Available</li>
            </ul>
            <div className="recycableGoods__container"> 
                <h4>Price for Recycable Goods</h4>
                <div className='materialsCard__grid'>
                <RecycleMaterialCard
                    // key={material.type}
                    material={'Paper'}
                    unit={'Kg'}
                    price={'50'}
                    color={'paperCategory'}
                />
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