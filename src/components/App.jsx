import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify'
import { PrimeReactProvider } from "primereact/api"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import store from "@store/store"
import Intro from "@components/intro"
import Header from "@ui/header/Header"
import { Recover, LoginForm } from "@components/login"
import OffersList from "./modules/user/offers/OffersList"
import Dashboard from "./modules/user/dashboard/Dashboard"
import { RegisterRole, RegisterUser } from "@components/register"
import Notifications from "./modules/user/notifications/Notifications"
import RegisterThankYouPage from "@components/register/registerThankYouPage/RegisterThankYouPage"

import 'primeicons/primeicons.css'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
	return <GoogleOAuthProvider clientId="510464940348-562le9obed61s1a4gk8clo1gh809lhvu.apps.googleusercontent.com">
		<Provider store={store}>
			<PrimeReactProvider>
				<BrowserRouter>
				<Header />
				{/* <RegisterThankYouPage /> */}
				<Routes>
					<Route exact path="/" element={<Intro />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/recover" element={<Recover />} />
					<Route exact path="/register" element={<RegisterRole />} />
					<Route exact path="/register/user" element={<RegisterUser />} />
					<Route exact path="/register/thankyoupage" element={<RegisterThankYouPage />} />

					<Route exact path="/dashboard/" element={<Dashboard />} />
					<Route exact path="/dashboard/notifications" element={<Notifications />} />
					<Route exact path="/dashboard/Offerslist" element={<OffersList />} />
				</Routes>
				</BrowserRouter>
			</PrimeReactProvider>
			<ToastContainer />
		</Provider>
	</GoogleOAuthProvider>
}
export default App