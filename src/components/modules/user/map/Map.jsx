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
  const [ zIndex, setZIndex ] = useState({})
  const [ bounds, setBounds ] = useState(null)
  const [ markers, setMarkers ] = useState([])
  const [current, setCurrent] = useState({lat: 0, lng: 0})
  const user = useSelector((state) => state.users.userData)

  const updateZIndex = (e, key) => {
    const _info = e.domEvent.type == 'mouseover'
    const _index = e.domEvent.type == 'mouseout' ? null : 9999
    setZIndex(prev => ({...prev, [key]: {index: _index, info: _info}}))
  }
  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = () => {
    const _location = window.autocomplete.getPlace()?.geometry?.location
    if(_location)
      setCurrent({ lat: _location.lat(), lng: _location.lng() })
  }
  const onLoad = useCallback(map => setMap(map), [])
  const onUnmount = useCallback(map => setMap(null), [])
  const extendBounds = (_bounds, factor) => {
    const ne = _bounds.getNorthEast()
    const sw = _bounds.getSouthWest()
    const latDiff = (ne.lat() - sw.lat()) * factor
    const lngDiff = (ne.lng() - sw.lng()) * factor
    return new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(sw.lat() - latDiff, sw.lng() - lngDiff),
      new window.google.maps.LatLng(ne.lat() + latDiff, ne.lng() + lngDiff)
    )
  }
  const updateBounds = () => {
    const _bounds = map?.getBounds()
    if(!bounds || !bounds.contains(_bounds.getNorthEast()) || !_bounds.contains(_bounds.getSouthWest()))
      setBounds(extendBounds(_bounds, 2))
  }
  const loadMarkers = async () => {
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    let _filter = {users: `u.role<>'user'`}
    _filter['bounds'] = `u.lat BETWEEN ${sw.lat()} AND ${ne.lat()} AND u.lng BETWEEN ${sw.lng()} AND ${ne.lng()}`
    let _response = await getUsers(_filter, 'full', user?.id)
    setMarkers(_response?.data)
  }
  const toCurrentLocation = async location => {
    if(location == 'current'){
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng }
          setCurrent(pos)
        }
      )
    }else
      setCurrent({ lat: parseFloat(user?.lat), lng: parseFloat(user?.lng) })
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
    if(bounds)
      loadMarkers()
  }, [bounds])
  useEffect(() => {
    dispatch(setHeader('map'))
    if(map && user?.default_location)
      toCurrentLocation(user.default_location)
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
          {show?.materials?.map(({type}, key) => 
            <Button key={key} label={type} className={'small mb-1 ' + type} />
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
      onBoundsChanged={updateBounds}
      options={{ styles: mapConfig }}
      mapContainerStyle={{ width: '100vw', height: '100vh' }}>
      <MarkerClustererF>
        {clusterer => <div>
          {markers.map((marker, key) => {
            return marker?.lat && marker?.lng && 
              <MarkerF key={key} data-key={key} position={{lat: parseFloat(marker?.lat), lng: parseFloat(marker?.lng)}} icon={{
                  url: getIcon(marker.role),
                  scaledSize: new window.google.maps.Size(60, 60)
                }}
                optimized={false}
                zIndex={zIndex[key]?.index}
                onClick={() => setShow(marker)}
                onMouseOut={e => updateZIndex(e, key)}
                onMouseOver={e => updateZIndex(e, key)}>
                {zIndex[key]?.info && 
                  <InfoBoxF>
                    <a className="map-card" onClick={() => setShow(marker)}>
                      <ProfilePhoto userPhoto={marker.picture} />
                      <h4>{marker.name}</h4>
                    </a>
                  </InfoBoxF>
                }
              </MarkerF>
          })}
        </div>}
      </MarkerClustererF>
      <MarkerF position={current} icon={{ url: "/assets/icons/map-home.svg", scaledSize: new window.google.maps.Size(60, 60) }}
        optimized={false}
        zIndex={zIndex?.home?.index}
        onMouseOut={e => updateZIndex(e, 'home')}
        onMouseOver={e => updateZIndex(e, 'home')} />
    </GoogleMap>
  </div>
}

export default Map