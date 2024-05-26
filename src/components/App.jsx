import AppRoutes from "./Routes"
import Providers from "./Providers"
import { ToastContainer } from "react-toastify"

import 'primeicons/primeicons.css'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return <Providers>
    <AppRoutes />
    <ToastContainer />
  </Providers>
}
export default App