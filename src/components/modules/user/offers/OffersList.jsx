import React from 'react'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const OffersList = () => {
  return (
    <div className="layout">
      <div className="main__content">
        <h4 className='text-defaultCase'>Offers</h4>
        <MultiUseCard 
        type='offer'
        title='Paperrecycle.org'
        description='Paper Waste for sale'
        date='11-02-2023 10:45 am'
        offer='sent you an offer: $225'
        orderStatus='Pending'
        />
         <MultiUseCard 
        type='offer'
        title='Paperrecycle.org'
        description='Paper Waste for sale'
        date='11-02-2023 10:45 am'
        offer='sent you an offer: $225'
        orderStatus='Rejected'
        />
      </div>
    </div>
  )
}

export default OffersList