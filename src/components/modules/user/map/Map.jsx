import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { GoogleMap, MarkerF, Autocomplete, InfoBoxF, MarkerClustererF } from '@react-google-maps/api'

import mapConfig from "@json/mapConfig.json"
import { getUsers } from '@services/userServices'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { updateUserData } from '@store/slices/usersSlice'
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
    let _response = await getUsers(`(role='company' OR role='vendors')`, 'full')
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
  }
  const toCurrentLocation = async location => {
    const geocoder = new window.google.maps.Geocoder()
    await loadMarkers()
    if(location == 'current'){
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng };
          setCurrent(pos);
        }
      )
    }
    else{
      geocoder.geocode({ address: user.address }, (response) => {
        if(response?.length > 0){
          const { lat, lng } = response[0].geometry.location
          setCurrent({ lat: lat(), lng: lng() })
        }
      })
    }
  }
  const getIcon = role => {
    if(role == 'vendor')
      return "/assets/icons/map-market-place.svg"
    return "/assets/icons/map-recycling-center.svg"
  }
  const changeDefault = (option) => {
    dispatch(updateUserData({data: {default_location: option}, filter: {id: user?.id}}))
  }

  useEffect(() => {
    dispatch(setHeader('map'))
    dispatch(setHeaderTitle('Mapa'))
    if(map && user?.default_location){
      toCurrentLocation(user.default_location)
    }
  }, [user, map])
  
  return <div className="layout fullwidth">
    {!user?.default_location && 
      <Dialog className="no-close" visible={true} onHide={changeDefault} draggable={false}>
        <div className='text-center'>
          <h4 className="mb-2">Select your default location</h4>
          <Button className="green-earth" onClick={() => changeDefault('home')}><FontAwesomeIcon icon={faHouse} /> Use address location</Button>
          <Button className="dark-blue" onClick={() => changeDefault('current')}><FontAwesomeIcon icon={faLocationCrosshairs} /> Use my current location</Button>
        </div>
      </Dialog>
    || null}
    <div className="navbar-item insection_header">
      <div className="search">
        <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
          <InputText
            placeholder="Search"
            className="p-inputtext" />
        </Autocomplete>
        <a onClick={() => toCurrentLocation('home')}><FontAwesomeIcon icon={faHouse} /></a>
        <a onClick={() => toCurrentLocation('current')}><FontAwesomeIcon icon={faLocationCrosshairs} /></a>
      </div>
    </div>
    {show && <div className="marker__detail">
      <a className="close" onClick={() => setShow(null)}>X</a>
      <ProfilePhoto className="mb-1" userPhoto={show.picture} />
      <h5 className="font-bold text-gray">{show.name}</h5>
      <p>{show.email}</p>
      <p>{show.phone}</p>
      {show?.materials?.length > 0 && 
        <div>
          {show?.materials?.map(({material}, key) => 
            <Button key={key} label={material} className={'small mb-1 ' + material} />
          )}
        </div>
      || null}
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
            return marker.position?.lat && marker.position?.lng && 
              <MarkerF key={key} position={marker.position} icon={{
                  url: getIcon(marker.role),
                  scaledSize: new window.google.maps.Size(60, 60)
                }} onClick={() => setShow(marker)}>
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
      <MarkerF position={current} icon={{ url: "/assets/icons/map-home.svg", scaledSize: new window.google.maps.Size(60, 60) }} />
    </GoogleMap>
  </div>
}

export default Map