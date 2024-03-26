import React from 'react'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const OffersList = () => {
  return (
    <div className="layout">
      <div className="main__content">
        <h4 className='text-defaultCase'>Offers</h4>
        <MultiUseCard 
        type='notification'
        title='New Notification'
        description='Green Earth Recycling sent you a new offer'
        date='11-02-2023 10:45 am'
        />
         <MultiUseCard 
        type='notification'
        title='New Notification'
        description='Green Earth Recycling sent you a new offer'
        date='11-02-2023 10:45 am'
        />
         <MultiUseCard 
        type='offer'
        title='New Notification'
        description='Green Earth Recycling sent you a new offer'
        date='11-02-2023 10:45 am'
        />
      </div>
    </div>
  )
}

export default OffersList