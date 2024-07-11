import AppRoutes from './Routes'
import Providers from './Providers'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'primeicons/primeicons.css'

const App = () => {
  return <Providers>
    <AppRoutes />
  </Providers>
}
export default App