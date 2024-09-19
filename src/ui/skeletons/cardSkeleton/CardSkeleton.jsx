import React from 'react'
import { Skeleton } from 'primereact/skeleton';
import './cardSkeleton.sass'

const CardSkeleton = ({className}) => {
  return (
      <div className={`card__skeleton ${className}`}>
            <div className="">
                <div className="flex mb-1">
                <div className='fullwidth'>
                    <Skeleton shape="circle" size="2.5rem" className="mr-2"></Skeleton>
                </div>
                    <div className='fullwidth'>
                        <Skeleton width="100%" className="mb-1"></Skeleton>
                        <Skeleton width="3.125rem" className="mb-1"></Skeleton>
                        <Skeleton height="0.3125rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="9.375rem"></Skeleton>
                <div className="flex justify-content-between mt-2">
                    <Skeleton  width="2.5rem" height="1.25rem"></Skeleton>
                    <Skeleton width="2.5rem" height="1.25rem"></Skeleton>
                </div>
            </div>
        </div>
  )
}

export default CardSkeleton