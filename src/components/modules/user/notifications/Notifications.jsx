import React from 'react'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const Notifications = () => {
  return (
    <div className="layout">
      <div className="main__content">
        <h4 className='text-defaultCase'>Notifications</h4>
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
        type='notification'
        title='New Notification'
        description='Green Earth Recycling sent you a new offer'
        date='11-02-2023 10:45 am'
        />
      </div>
    </div>
  )
}

export default Notifications