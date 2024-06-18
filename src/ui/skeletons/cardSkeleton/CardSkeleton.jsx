import React from 'react'
import { Skeleton } from 'primereact/skeleton';
import './cardSkeleton.sass'

const CardSkeleton = () => {
  return (
      <div className="card__skeleton">
            <div className="">
                <div className="flex mb-1">
                <div className='fullwidth'>
                    <Skeleton shape="circle" size="40rem" className="mr-2"></Skeleton>
                </div>
                    <div className='fullwidth'>
                        <Skeleton width="100%" className="mb-1"></Skeleton>
                        <Skeleton width="50rem" className="mb-1"></Skeleton>
                        <Skeleton height="5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150rem"></Skeleton>
                <div className="flex justify-content-between mt-2">
                    <Skeleton width="40rem" height="20rem"></Skeleton>
                    <Skeleton width="40rem" height="20rem"></Skeleton>
                </div>
            </div>
        </div>
  )
}

export default CardSkeleton