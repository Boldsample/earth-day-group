import i18next from "i18next"
import { Provider } from "react-redux"
import { I18nextProvider } from "react-i18next"
import { FacebookProvider } from "react-facebook"
import { LoadScript } from "@react-google-maps/api"
import { PrimeReactProvider } from "primereact/api"
import { GoogleOAuthProvider } from "@react-oauth/google"

import store from "@store/store"
import lang_es from "@lang/es.json"
import lang_en from "@lang/en.json"

i18next.init({
  lng: 'es',
  interpolation: { escapeValue: false },
  resources: {
    es: { translation: lang_es },
    en: { translation: lang_en },
  }
})

const Providers = ({ children }) => {

  return <I18nextProvider i18n={i18next}>
    <GoogleOAuthProvider clientId="510464940348-562le9obed61s1a4gk8clo1gh809lhvu.apps.googleusercontent.com">
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
  </I18nextProvider>
}

export default Providers