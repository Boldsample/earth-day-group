import AppRoutes from "./Routes"
import Providers from "./Providers"

import 'primeicons/primeicons.css'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return <Providers>
    <AppRoutes />
  </Providers>
}
export default App