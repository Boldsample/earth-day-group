import './utils/styles/main.sass'
import './utils/styles/responsive.sass'
import 'react-toastify/dist/ReactToastify.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/layout/App'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)