import { useDispatch } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api'

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './style.sass'
import { Link } from 'react-router-dom'

const markers = [
	{info: 'Save the planet', position: {lat: 3.488742097044893, lng: -76.51978685923574}},
	{info: 'Save the planet', position: {lat: 3.397300873511612, lng: -76.53998383163757}},
	{info: 'Save the planet', position: {lat: 3.436779237506472, lng: -76.4991927872059}},
	{info: 'Save the planet', position: {lat: 3.4669553156810524, lng: -76.5449532989795}},
	{info: 'Save the planet', position: {lat: 3.4865899184917106, lng: -76.49753629809192}},
	{info: 'Save the planet', position: {lat: 3.419623917670457, lng: -76.54308974872627}},
]

const Map = () => {
	const dispatch = useDispatch()
	const [ map, setMap ] = useState(null)
	const [ show, setShow ] = useState(null)
	const [current, setCurrent] = useState({lat: 0, lng: 0})
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: "AIzaSyA6Ml_ldHM_SaImawJPIitRZ8T-EJGl2VI"
	})

	const onLoad = useCallback(map => {
		setMap(map)
	}, [])
	const onUnmount = useCallback(map => {
		setMap(null)
	}, [])

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
		{show && <div className="marker__detail">
			<ProfilePhoto className="mb-1" userPhoto={null} />
			<h5 className="font-bold text-gray">Rainbow Shop</h5>
			<p>r.shop@gmail.com</p>
			<p>+57 315 323 6464</p>
			<h5 className="font-bold mb-1">Pick at Home</h5>
			<p className="small mb-1">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
			<Link className="button dark-blue">Learn more</Link>

		</div>}
		{isLoaded && <GoogleMap
			zoom={13}
			onLoad={onLoad}
			center={current}
			onUnmount={onUnmount}
			mapContainerStyle={{ width: '100vw', height: '100vh' }}>
			<MarkerF icon="/assets/map/marker-1.svg" position={current} onClick={() => {}} />
			{markers.map(({position, info}, key) => <MarkerF key={key} icon="/assets/map/marker-2.svg" position={position} onClick={() => setShow(true)}>
				<InfoWindowF position={position} onClick={() => setShow(true)}>
					<a className="map-card" onClick={() => setShow(true)}>
						<ProfilePhoto userPhoto={null} />
						{info}
					</a>
				</InfoWindowF>
			</MarkerF>)}
		</GoogleMap>}
	</div>
}

export default Map