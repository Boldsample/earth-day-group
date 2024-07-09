import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GoogleMap, MarkerF, Autocomplete, InfoBoxF, MarkerClustererF } from '@react-google-maps/api'
import { faChevronDown, faChevronUp, faHouse, faLocationCrosshairs, faTimes } from '@fortawesome/free-solid-svg-icons'

import mapConfig from "@json/mapConfig.json"
import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { updateUserData } from '@store/slices/usersSlice'

import './style.sass'
import { RadioButton } from 'primereact/radiobutton'
import { Checkbox } from 'primereact/checkbox'

const Map = () => {
  const dispatch = useDispatch()
  const [ map, setMap ] = useState(null)
  const [ show, setShow ] = useState(null)
  const [ zIndex, setZIndex ] = useState({})
  const [ update, setUpdate ] = useState(null)
  const [ markers, setMarkers ] = useState([])
  const [ showFilters, setShowFilters ] = useState(false)
  const [current, setCurrent] = useState({lat: 0, lng: 0})
  const user = useSelector((state) => state.users.userData)
  const [ filters, setFilters ] = useState({role: [], material: []})

  const updateFilter = e => {
    setFilters(_prev => {
      if(e?.checked)
        _prev[e?.target?.name].push(e?.value)
      else
        _prev[e?.target?.name].splice(_prev[e?.target?.name]?.indexOf(e?.value), 1)
      return {..._prev}
    })
    setUpdate(_prev => ({..._prev, date: new Date()}))
  }
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
    if(!update?.bounds || !update?.bounds.contains(_bounds.getNorthEast()) || !update?.bounds.contains(_bounds.getSouthWest()))
      setUpdate({bounds: extendBounds(_bounds, 2), date: new Date()})
  }
  const loadMarkers = async () => {
    const ne = update?.bounds.getNorthEast()
    const sw = update?.bounds.getSouthWest()
    let _filter = {users: `u.role<>'user'`}
    if(filters?.role?.length > 0){
      let _role = [...filters?.role]
      if(_role.includes('shelter') || _role.includes('social'))
        _role.push('ngo')
      _filter.role = "(u.role='"+_role.join("' OR u.role='")+"')"
    }
    if(filters?.material?.length > 0)
      _filter.material = "EXISTS (SELECT 1 FROM materials m WHERE (m.type='"+filters?.material.join("' OR m.type='")+"') AND m.user=u.id)"
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
    if(role == 'social' || role == 'ngo')
      return "/assets/icons/map-social.svg"
    if(role == 'shelter')
      return "/assets/icons/map-shelter.svg"
    if(role == 'vendor')
      return "/assets/icons/map-market-place.svg"
    return "/assets/icons/map-recycling-center.svg"
  }
  const changeDefault = (option) => {
    dispatch(updateUserData({data: {default_location: option}, filter: {id: user?.id}}))
  }

  useEffect(() => {
    if(update)
      loadMarkers()
  }, [update])
  useEffect(() => {
    dispatch(setHeader('map'))
    if(map && user?.default_location)
      toCurrentLocation(user.default_location)
  }, [user, map])
  
  return <div className="layout fullwidth no-overflow">
    {!user?.default_location && 
      <Dialog className="no-close" visible={true} onHide={changeDefault} draggable={false}>
        <div className="text-center">
          <h4 className="mb-2">Select your default location</h4>
          <Button className="green-earth" onClick={() => changeDefault('home')}><FontAwesomeIcon icon={faHouse} /> Use address location</Button>
          <Button className="dark-blue" onClick={() => changeDefault('current')}><FontAwesomeIcon icon={faLocationCrosshairs} /> Use my current location</Button>
        </div>
      </Dialog>
    || null}
    <div className="navbar-item insection_header">
      <div className="edg-search">
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
      <a className="close" onClick={() => setShow(null)}><FontAwesomeIcon icon={faTimes} /></a>
      <ProfilePhoto className="mb-1" userPhoto={show.picture} />
      <h4 className="font-bold">{show.name}</h4>
      <p>{show.email}</p>
      <p>{show.phone}</p>
      <p className="small">&nbsp;</p>
      <p className="small">{show.description}</p>
      <p className="small">&nbsp;</p>
      {show?.materials?.length > 0 && <>
        <h5 className="font-bold mb-1">Interested in buying:</h5>
        <div>
          {show?.materials?.map(({type}, key) => 
            <Button key={key} label={type} className={'small mb-1 ' + type} />
        )}
        </div>
      </>}
      <p className="small">&nbsp;</p>
      {show.role == 'companies' && <>
        <h5 className="font-bold">Pickup at Home: <span className="text-gray font-regular">{show.pick_up_from_home ? 'Available' : 'Unavailable'}</span></h5>
        <p className="small">&nbsp;</p>
      </>}
      <Link to={`/company/${show.id}`} className="button dark-blue">Learn more</Link>
    </div>}
    <div className={'map__filters '+(showFilters ? 'show' : '')}>
      <a className="open" onClick={() => setShowFilters(prev => !prev)}><FontAwesomeIcon icon={showFilters ? faChevronDown : faChevronUp} /></a>
      <h5 className="text-dark-blue fullwidth font-bold">Filter by:</h5>
      <div className="radio"><Checkbox inputId="role_company" name="role" value="company" checked={filters?.role.includes('company')} onChange={updateFilter} /> <label htmlFor="role_company">Recycle companies</label></div>
      <div className="radio"><Checkbox inputId="role_shelter" name="role" value="shelter" checked={filters?.role.includes('shelter')} onChange={updateFilter} /> <label htmlFor="role_shelter">Shelters</label></div>
      <div className="radio"><Checkbox inputId="role_vendor" name="role" value="vendor" checked={filters?.role.includes('vendor')} onChange={updateFilter} /> <label htmlFor="role_vendor">Shops</label></div>
      <div className="radio"><Checkbox inputId="role_social" name="role" value="social" checked={filters?.role.includes('social')} onChange={updateFilter} /> <label htmlFor="role_social">Social organizations</label></div>
      {filters?.role.includes('company') && <>
      <h5 className="text-dark-blue fullwidth font-bold mt-2">Choose a material:</h5>
      <div className="radio"><Checkbox inputId="material_paper" name="material" value="Paper" checked={filters?.material.includes('Paper')} onChange={updateFilter} /> <label htmlFor="material_paper">Paper</label></div>
      <div className="radio"><Checkbox inputId="material_glass" name="material" value="Glass" checked={filters?.material.includes('Glass')} onChange={updateFilter} /> <label htmlFor="material_glass">Glass</label></div>
      <div className="radio"><Checkbox inputId="material_plastic" name="material" value="Plastic" checked={filters?.material.includes('Plastic')} onChange={updateFilter} /> <label htmlFor="material_plastic">Plastic</label></div>
      <div className="radio"><Checkbox inputId="material_e-waste" name="material" value="E-Waste" checked={filters?.material.includes('E-Waste')} onChange={updateFilter} /> <label htmlFor="material_e-waste">E-Waste</label></div>
      <div className="radio"><Checkbox inputId="material_metal" name="material" value="Metal" checked={filters?.material.includes('Metal')} onChange={updateFilter} /> <label htmlFor="material_metal">Metal</label></div>
      <div className="radio"><Checkbox inputId="material_organic" name="material" value="Organic" checked={filters?.material.includes('Organic')} onChange={updateFilter} /> <label htmlFor="material_organic">Organic</label></div>
      </>}
    </div>
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