import i18next from "i18next"
import { Provider } from "react-redux"
import { FacebookProvider } from "react-facebook"
import { LoadScript } from "@react-google-maps/api"
import { PrimeReactProvider } from "primereact/api"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { initReactI18next, I18nextProvider } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import store from "@store/store"
import lang_es from "@lang/es.json"
import lang_en from "@lang/en.json"
import { useEffect, useState } from "react"

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    lookupNavigator: true,  // Asegura que se busque el idioma del navegador
    lookupFromPathIndex: 0, // Asegura que se busque en la URL si está disponible
    lookupFromSubdomainIndex: 0,
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    resources: {
      es: { translation: lang_es },
      en: { translation: lang_en },
    }
  })

const Providers = ({ children }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if(!localStorage.getItem('i18nextLoaded')){
      localStorage.removeItem('i18nextLng')
      localStorage.setItem('i18nextLoaded', true)
    }
    i18next.on('languageChanged', () => setIsReady(true))
    i18next.changeLanguage('')
  }, []);

  if(!isReady)
    return null
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