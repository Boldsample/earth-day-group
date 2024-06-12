import ReactDOM from 'react-dom/client'

import App from '@components/App'

import "@styles/main.sass"
import "@styles/forms.sass"
import "primereact/resources/themes/lara-light-indigo/theme.css"

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<App />
	// </React.StrictMode>
)