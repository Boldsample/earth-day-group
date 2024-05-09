import { Link } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faSearch } from '@fortawesome/free-solid-svg-icons'
import { GoogleMap, MarkerF, Autocomplete, InfoBoxF, MarkerClustererF } from '@react-google-maps/api'

import mapConfig from "@json/mapConfig.json"
import { getUsers } from '@services/userServices'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './style.sass'

const Map = () => {
  const dispatch = useDispatch()
  const [ map, setMap ] = useState(null)
  const [ show, setShow ] = useState(null)
  const [ markers, setMarkers ] = useState([])
  const [current, setCurrent] = useState({lat: 0, lng: 0})
  const user = useSelector((state) => state.users.userData)

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onLoad = useCallback(map => setMap(map), [])
  const onUnmount = useCallback(map => setMap(null), [])
  const onPlaceChanged = () => {
    const _place = window.autocomplete.getPlace()
    const _location = _place?.geometry?.location
    if(_location)
      setCurrent({ lat: _location.lat(), lng: _location.lng() })
  }
  const loadMarkers = async () => {
    let _response = await getUsers({role: 'company'})
    const geocoder = new window.google.maps.Geocoder()
    const geocodePromises = _response?.map(async marker => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: marker.address }, (response, status) => {
          if(response?.length > 0){
            const { lat, lng } = response[0].geometry.location
            marker.position = { lat: lat(), lng: lng() }
            resolve(marker)
          }else
            reject(status)
        })
      })
    })
    const _markers = await Promise.allSettled(geocodePromises)
    setMarkers(_markers
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value))
    geocoder.geocode({ address: user.address }, (response) => {
      if(response?.length > 0){
        const { lat, lng } = response[0].geometry.location
        setCurrent({ lat: lat(), lng: lng() })
      }
    })
  }
  const toCurrentLocation = () => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setCurrent(pos);
      }
    )
  }

  useEffect(() => {
    loadMarkers()
    dispatch(setHeader('map'))
    dispatch(setHeaderTitle('Mapa'))
  }, [])
  
  return <div className="layout">
    <div className="navbar-item map__search">
      <div className="search">
        <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
          <InputText
            placeholder="Search"
            className="p-inputtext" />
        </Autocomplete>
        <a onClick={toCurrentLocation}><FontAwesomeIcon icon={faLocationCrosshairs} /></a>
      </div>
    </div>
    {show && <div className="marker__detail">
      <a className="close" onClick={() => setShow(null)}>X</a>
      <ProfilePhoto className="mb-1" userPhoto={show.picture} />
      <h5 className="font-bold text-gray">{show.name}</h5>
      <p>{show.email}</p>
      <p>{show.phone}</p>
      {show.pick_up_from_home && <h5 className="font-bold mb-1">Pick at Home</h5>}
      <p className="small mb-1">{show.description}</p>
      <Link to={`/company/${show.id}`} className="button dark-blue">Learn more</Link>
    </div>}
    <GoogleMap
      zoom={16}
      onLoad={onLoad}
      center={current}
      onUnmount={onUnmount}
      options={{ styles: mapConfig }}
      mapContainerStyle={{ width: '100vw', height: '100vh' }}>
      <MarkerClustererF>
        {clusterer => <div>
          {markers.map((marker, key) => {
            return marker.position?.lat && marker.position?.lng && <MarkerF key={key} icon={{
              url: "/assets/icons/map-recycling-center.svg",
              scaledSize: new window.google.maps.Size(60, 60)
            }} position={marker.position} onClick={() => setShow(marker)}>
              <InfoBoxF>
                <a className="map-card" onClick={() => setShow(marker)}>
                  <ProfilePhoto userPhoto={marker.picture} />
                  <h4>{marker.name}</h4>
                </a>
              </InfoBoxF>
            </MarkerF>
          })}
        </div>}
      </MarkerClustererF>
      <MarkerF icon={{
        url: "/assets/icons/map-home.svg",
        scaledSize: new window.google.maps.Size(60, 60)
      }} position={current} onClick={() => {}} />
    </GoogleMap>
  </div>
}

export default Map