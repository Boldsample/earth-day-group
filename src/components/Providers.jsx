import { Provider } from "react-redux"
import { FacebookProvider } from "react-facebook"
import { LoadScript } from "@react-google-maps/api"
import { PrimeReactProvider } from "primereact/api"
import { GoogleOAuthProvider } from "@react-oauth/google"

import store from "@store/store"

const Providers = ({ children }) => {
  return <GoogleOAuthProvider clientId="510464940348-562le9obed61s1a4gk8clo1gh809lhvu.apps.googleusercontent.com">
    <FacebookProvider appId="1357569244808289">
      <LoadScript googleMapsApiKey="AIzaSyA6Ml_ldHM_SaImawJPIitRZ8T-EJGl2VI" libraries={['places']} loading="async">
        <Provider store={store}>
          <PrimeReactProvider>
            {children}
          </PrimeReactProvider>
        </Provider>
      </LoadScript>
    </FacebookProvider>
  </GoogleOAuthProvider>
}

export default Providers