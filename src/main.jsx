import "@styles/main.sass"
import "@styles/forms.sass"
import "@styles/responsive.sass"
import "react-toastify/dist/ReactToastify.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<App />
	// </React.StrictMode>
)