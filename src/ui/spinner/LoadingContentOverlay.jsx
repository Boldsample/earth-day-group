import React from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { useSelector } from "react-redux"
import "./loadingContentOverlay.sass"

const LoadingContentOverlay = ({children}) => {
  const loading = useSelector((state) => state.global.loading)

  return (
    <LoadingOverlay
      active={loading}
      spinner
      className='overLay__position'
    >
      {children}
    </LoadingOverlay>
  )
}

export default LoadingContentOverlay