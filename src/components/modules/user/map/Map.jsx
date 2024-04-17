import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { LoadScript, GoogleMap } from '@react-google-maps/api'

import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

const markers = [
	{lat: 73.93287142902778, lng: 125.47108868789186},
	{lat: 73.57446580409672, lng: 125.561162581528},
	{lat: 73.58171241309896, lng: 125.52680010693255},
]

const Map = () => {
	const dispatch = useDispatch()
	const [current, setCurrent] = useState({lat: 0, lng: 0})

	useEffect(() => {
		dispatch(setHeader('map'))
		dispatch(setHeaderTitle('Mapa'))
		navigator?.geolocation.getCurrentPosition(
			({ coords: { latitude: lat, longitude: lng } }) => {
				const pos = { lat, lng };
				setCurrent(pos);
			}
		)
	}, [])
		
	return <div className="layout">
		<LoadScript googleMapsApiKey="AIzaSyA6Ml_ldHM_SaImawJPIitRZ8T-EJGl2VI">
			<GoogleMap
				zoom={16}
				center={current}
				mapContainerStyle={{ width: '100vw', height: '100vh' }}
				onClick={(e) => console.log(e)} >
				{//markers.map((m, k) => <Marker key={k} position={{lat: m.lat, lng: m.lng}} icon="https://cdn-icons-png.flaticon.com/128/12703/12703539.png" />)
				}
				{/* <AdvancedMarker
					position={{lat: 73.57446580409672, lng: 125.561162581528}}
					title={'AdvancedMarker with customized pin.'}>
					<Pin
						background={'#22ccff'}
						borderColor={'#1e89a1'}
						glyphColor={'#0f677a'}></Pin>
				</AdvancedMarker> */}
			</GoogleMap>
		</LoadScript>
	</div>
}

export default Map