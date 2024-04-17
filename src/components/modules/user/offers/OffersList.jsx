import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const OffersList = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('user'))
		dispatch(updateAddLink('/offers/new/'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-1.svg" />
		<div className="main__content halfspace halfwidth">
			<h1 className='text-defaultCase'>My Offers</h1>
			<MultiUseCard 
				type='offer'
				title='Paper waste for sale'
				material={['Paper']}
				quantity='25 Kg'
				price='$250.00'
				offers='24'
				receive={true}
				date='11-02-2023' />
		</div>
	</div>
}

export default OffersList