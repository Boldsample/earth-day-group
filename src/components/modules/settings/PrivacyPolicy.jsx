import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const PrivacyPolicy = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle('About Earth Day Group'))
  }, [])

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content">
      <div className="about">
        <p>EARTH DAY GROUP es una iniciativa Ambiental que nace en la ciudad de Cali, Colombia con el firme propósito de convertirse en un puente que acorte la distancias entre las personas y un mundo consciente y sostenible.</p>
        <p>Nuestra misión es utilizar medios tecnológicos para poner al alcance de las personas centros y/o empresas de reciclaje, fundaciones sociales, refugios de animales, productos ecológicos y educación ambiental, facilitándoles a todos desarrollar y mantener hábitos más amigables con el medio ambiente.</p>
      </div>
    </div>
  </div>
}

export default PrivacyPolicy