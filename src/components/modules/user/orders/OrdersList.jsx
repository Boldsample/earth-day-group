import { useDispatch } from 'react-redux'
import { Button } from "primereact/button"
import { useEffect, useState } from 'react'

import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const Orders = [
	{ status: "Pending", title: "Order #1003", date: "12-04-2023 11:34" },
	{ status: "Completed", title: "Order #1002", date: "12-04-2023 11:34" },
	{ status: "Canceled", title: "Order #1001", date: "12-04-2023 11:34" }
]

const OrdersList = () => {
	const dispatch = useDispatch()
	const [filter, setFilter] = useState('')

	const handlerFilter = (f) => setFilter(f == filter ? '' : f)

	useEffect(() => {
		dispatch(setHeader('user'))
		dispatch(updateAddLink('/offers/new/'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-4.svg" />
		<div className="main__content halfspace" style={{alignContent: 'flex-start'}}>
			<h1 className="text-defaultCase mt-2">My Orders</h1>
			<div className="mt-2 mb-1">
				<h5 className="font-bold text-gray mb-1">Filters</h5>
				<Button className="small" label="All" onClick={() => handlerFilter('')} />
				<Button className="small outline blue-earth" label="Pending" onClick={() => handlerFilter('Pending')} />
				<Button className="small outline green-earth" label="Completed" onClick={() => handlerFilter('Completed')} />
				<Button className="small outline red-state" label="Canceled" onClick={() => handlerFilter('Canceled')} />
			</div>
			{Orders.filter(order => order.status == filter || filter == '').map((o, key) => <MultiUseCard key={key} 
				type="order"
				date={o.date}
				title={o.title}
				status={o.status} />)}
		</div>
	</div>
}

export default OrdersList