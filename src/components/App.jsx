import AppRoutes from './Routes'
import { useEffect } from 'react'
import Providers from './Providers'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'primeicons/primeicons.css'

const App = () => {
  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    }, { passive: false });
    document.addEventListener("keydown", function (event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "+" || event.key === "-" || event.key === "0")
      ) {
        event.preventDefault();
      }
    });
    return () => {
      document.removeEventListener("wheel", function () { });
      document.removeEventListener("keydown", function () { });
    };
  }, []);
  
  return <Providers>
    <AppRoutes />
  </Providers>
}
export default App