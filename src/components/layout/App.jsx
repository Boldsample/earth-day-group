import { configureStore } from '@reduxjs/toolkit'
import { PrimeReactProvider } from "primereact/api"
import Tailwind from 'primereact/passthrough/tailwind'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import Intro from '../modules/static/pages/Intro'

const store = configureStore({
	reducer: {},
});
const App = () => {
	return <PrimeReactProvider>
		<Header />
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={<Intro />} />
			</Routes>
		</BrowserRouter>
	</PrimeReactProvider>
}
export default App