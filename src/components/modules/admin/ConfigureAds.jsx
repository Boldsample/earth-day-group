import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ConfigureAds = () => {
    const user = useSelector((state) => state.users.userData)
    console.log("hello")
  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
        <h1>hello world</h1>
        </div>
    </div>
  )
}

export default ConfigureAds