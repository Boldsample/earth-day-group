import React from 'react'
import { Skeleton } from 'primereact/skeleton';
import './cardSkeleton.sass'

const CardSkeleton = () => {
  return (
      <div className="card__skeleton">
            <div className="">
                <div className="flex mb-1">
                <div className='fullwidth'>
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                </div>
                    <div className='fullwidth'>
                        <Skeleton width="100%" className="mb-1"></Skeleton>
                        <Skeleton width="5rem" className="mb-1"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div className="flex justify-content-between mt-2">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
  )
}

export default CardSkeleton