import { useState, useEffect } from "react"
import { useNavigate, useLocation, Routes } from "react-router-dom"

function PageAnimate({ children }) {
  const location = useLocation()
  const [nextPath, setNextPath] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(location.pathname)

  const handleTransitionEnd = () => {
    if(nextPath){
      setCurrentPath(nextPath)
      setNextPath(null)
    }
  }

  useEffect(() => {
    if(location.pathname != currentPath){
      setIsTransitioning(true)
      setNextPath(location.pathname)
    }
  }, [location.pathname]);

  return <>
    <Routes location={{ pathname: currentPath }}>{children}</Routes>
    {isTransitioning && <div className="transition-overlay">
      <div className="enter-animation" onAnimationEnd={handleTransitionEnd}></div>
      <div className="exit-animation" onAnimationEnd={() => { console.log('endTrans'); setIsTransitioning(false)}}></div>
    </div>}
  </>
}

export default PageAnimate;