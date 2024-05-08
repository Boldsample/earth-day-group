import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getOffers } from '@services/offersServices'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const Offers = () => {
	const dispatch = useDispatch()
	const [offers, setOffers] = useState([])
  const user = useSelector((state) => state.users.userData)

  const callOffers = async () =>{
    const _offers = await getOffers({ user: user.id })
    setOffers(_offers)
  }

	useEffect(() => {
    callOffers()
		dispatch(setHeader('user'))
		dispatch(updateAddLink('/offers/new/'))
	}, [user])
	
	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-1.svg" />
		<div className="main__content halfspace halfwidth">
			<h1 className='text-defaultCase'>My Offers</h1>
			{offers?.length ? 
				offers?.map(offer => <MultiUseCard 
					offers='24'
					type='offer'
          key={offer.id}
					receive={true}
					title={offer.title}
					material={[offer.material]}
					quantity={offer.quantity}
					price={offer.price}
					date='11-02-2023' />) : 
        <div className="mt-2">
          <p>You didn’t post any offer yet.</p>
          <Link className="button dark-blue mt-1" to="/offers/new">Create post offer</Link>
        </div>
      }
		</div>
	</div>
}

export default Offers