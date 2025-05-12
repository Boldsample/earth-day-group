import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoComplete } from 'primereact/autocomplete'
import { getUsers } from '@services/userServices';
import { useSelector } from 'react-redux';

function SearchPlaces({ placesService, autocompleteService, setCenter, updateBounds, onUserSelect }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'user.map'})

  const searchPlaces = async (query) => {
    if (!autocompleteService || !query) return
    const googlePromise = new Promise((resolve) => {
      autocompleteService.getPlacePredictions({ input: query }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const googleResults = predictions.map(p => ({
            placeId: p.place_id,
            label: p.description,
            source: 'google',
          }))
          resolve(googleResults)
        } else
          resolve([])
      })
    })
    const usersPromise = getUsers({
        user: `u.role<>'admin' AND u.role<>'user' AND u.state=1`,
        keyword: `(LOWER(u.name) LIKE LOWER('%${query}%') OR LOWER(u.email) LIKE LOWER('%${query}%'))`,
      }, 'full', user?.id
    ).then((res) =>
      res.data.map((u) => ({
        userId: u.id,
        label: u.name,
        source: 'companies',
        lat: parseFloat(u.lat),
        lng: parseFloat(u.lng)
      }))
    ).catch(() => []);
    const [googleResults, userResults] = await Promise.all([googlePromise, usersPromise])
    setSuggestions([...userResults, ...googleResults]);
  }
  const onSelect = (e) => {
    const placeId = e.value.placeId
    if(e.value.source == 'google'){
      placesService.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location = place.geometry.location
          setCenter({ lat: location.lat(), lng: location.lng() })
        }
      })
    }else{
      setCenter({lat: e.value.lat, lng: e.value.lng})
      onUserSelect(e.value.userId)
    }
    setValue('')
    updateBounds()
  }

  return <AutoComplete 
    value={value}
    field="label"
    onSelect={onSelect}
    suggestions={suggestions}
    onChange={(e) => setValue(e.value)}
    placeholder={t('inputSearchPlaceHolder')}
    completeMethod={(e) => searchPlaces(e.query)}
  />
}

export default SearchPlaces