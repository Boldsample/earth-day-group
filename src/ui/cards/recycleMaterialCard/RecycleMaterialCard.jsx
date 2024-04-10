import React from 'react'
import './recycleMaterialCard.sass'

const RecycleMaterialCard = () => {
  return (
    <div className='recycle__card'>
        <span>circle</span>
        <div className="body__container">
            <p>Paper</p>
            <p>1kg:$2.5</p>
        </div>
    </div>
  )
}

export default RecycleMaterialCard