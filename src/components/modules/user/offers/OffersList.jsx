import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'
import { getAllOffers } from '@services/offersServices'

const OffersList = () => {
	const [offersList, setOffersList] = useState([])
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setHeader('user'))
		dispatch(updateAddLink('/offers/new/'))
		const getOffers = async  () =>{
			const offers = await getAllOffers("offers")
			setOffersList(offers)
		}
		getOffers()
	}, [])
	console.log(offersList)
	// console.log(getAllOffers("offers"))
	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-1.svg" />
		<div className="main__content halfspace halfwidth">
			<h1 className='text-defaultCase'>My Offers</h1>
			{offersList.map(offer => <MultiUseCard 
				type='offer'
				title={offer.title}
				material={[offer.material]}
				quantity={offer.quantity}
				price={offer.price}
				offers='24'
				receive={true}
				date='11-02-2023' />)}
		</div>
	</div>
}

export default OffersList