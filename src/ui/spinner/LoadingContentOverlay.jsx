import { useSelector } from "react-redux"
import LoadingOverlay from "react-loading-overlay"

import "./loadingContentOverlay.sass"

const LoadingContentOverlay = ({children}) => {
  const loading = useSelector((state) => state.global.loading)

  return <>
    {children}
  </>
  return <LoadingOverlay spinner active={loading} className='overLay__position'>
    {children}
  </LoadingOverlay>
}

export default LoadingContentOverlay