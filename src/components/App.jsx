import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify'
import { FacebookProvider } from "react-facebook"
import { LoadScript } from "@react-google-maps/api"
import { PrimeReactProvider } from "primereact/api"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import store from "@store/store"
import Intro from "@components/intro"
import Header from "@ui/header/Header"
import Profile from "./modules/company/Profile"
import { Forgot, Recover, LoginForm } from "@components/login"
import ThankYouPage from "@components/thankYouPage/ThankYouPage"
import Notifications from "@components/notifications/Notifications"
import { RegisterRole, RegisterUser, RegisterCompany } from "@components/register"
import { Dashboard, OffersList, OfferNew, Map, OrdersList, Settings } from "@modules/user"

import 'primeicons/primeicons.css'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return <GoogleOAuthProvider clientId="510464940348-562le9obed61s1a4gk8clo1gh809lhvu.apps.googleusercontent.com">
    <FacebookProvider appId="1357569244808289">
      <LoadScript googleMapsApiKey="AIzaSyA6Ml_ldHM_SaImawJPIitRZ8T-EJGl2VI" libraries={['places']} loading="async">
        <Provider store={store}>
          <PrimeReactProvider>
            <BrowserRouter>
            <Header />
            <Routes>
              <Route exact path="/" element={<Intro />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/recover" element={<Recover />} />
              <Route path="/thankyou" element={<ThankYouPage />} />
              <Route exact path="/register" element={<RegisterRole />} />
              <Route exact path="/register/user" element={<RegisterUser />} />
              <Route exact path="/register/company" element={<RegisterCompany />} />

              <Route exact path="/dashboard/" element={<Dashboard />} />
              <Route exact path="/dashboard/notifications" element={<Notifications />} />
              <Route exact path="/offers" element={<OffersList />} />
              <Route exact path="/offers/new" element={<OfferNew />} />
              <Route exact path="/location" element={<Map />} />
              <Route exact path="/orders/" element={<OrdersList />} />
              <Route exact path="/settings/" element={<Settings />} />
              <Route exact path="/profile/" element={<Profile />} />
            </Routes>
            </BrowserRouter>
          </PrimeReactProvider>
          <ToastContainer />
        </Provider>
      </LoadScript>
    </FacebookProvider>
  </GoogleOAuthProvider>
}
export default App