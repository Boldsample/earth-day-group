import ReactDOM from 'react-dom/client'

import App from '@components/App'

import "@styles/main.sass"
import "@styles/forms.sass"
import "@styles/responsive.sass"
import "primereact/resources/themes/lara-light-green/theme.css"

if(!localStorage?.i18nextLoaded){
	localStorage.removeItem('i18nextLng')
	localStorage.setItem('i18nextLoaded', true)
}

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<App />
	// </React.StrictMode>
)