import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useLocation, Routes } from "react-router-dom"

function PageAnimate({ children }) {
  const location = useLocation()
  const [nextPath, setNextPath] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(location.pathname)

  const handleTransitionEnd = () => {
    if(nextPath){
      setCurrentPath(nextPath)
      setNextPath(null)
      window.scrollTo({ top: 0 })
    }
  }

  useEffect(() => {
    if(location.pathname != currentPath){
      const _cur = currentPath.split('/')
      const _new = location.pathname.split('/')
      if(user?.id && (_cur[1] != _new[1] || (!isNaN(_new[2]) && _new[2] != '' && _cur[1] != 'offers') || _cur[1] == 'chat' || _cur[2] == 'new' || _new[2] == 'new')){
        setIsTransitioning(true)
        setNextPath(location.pathname)
      }else{
        setCurrentPath(location.pathname)
        setNextPath(null)
      }
    }
  }, [location.pathname]);

  return <>
    <Routes location={{ pathname: currentPath }}>{children}</Routes>
    {isTransitioning && <div className="transition-overlay">
      <div className="enter-animation" onAnimationEnd={handleTransitionEnd}></div>
      <div className="exit-animation" onAnimationEnd={() => setIsTransitioning(false)}></div>
    </div>}
  </>
}

export default PageAnimate;