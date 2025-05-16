import AppRoutes from './Routes'
import { useEffect } from 'react'
import Providers from './Providers'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'primeicons/primeicons.css'

const App = () => {
  useEffect(() => {
    const preventZoom = (event) => {
      if (event.ctrlKey || (event.metaKey && (event.key === '+' || event.key === '-' || event.key === '0')))
        event.preventDefault()
    }
    const preventWheelZoom = (event) => {
      if (event.ctrlKey)
        event.preventDefault()
    }
    document.addEventListener('wheel', preventWheelZoom, { passive: false })
    document.addEventListener('keydown', preventZoom)

    const updateVh = () => {
      const vh = (window.visualViewport?.height || window.innerHeight) * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    updateVh()
    window.visualViewport?.addEventListener('resize', updateVh)
    window.addEventListener('resize', updateVh)

    return () => {
      document.removeEventListener('wheel', preventWheelZoom)
      document.removeEventListener('keydown', preventZoom)
      window.visualViewport?.removeEventListener('resize', updateVh)
      window.removeEventListener('resize', updateVh)
    }
  }, []);
  
  return <Providers>
    <AppRoutes />
  </Providers>
}
export default App