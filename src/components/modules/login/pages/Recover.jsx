import '..//ui/style.sass'
import '../../static/ui/style.sass'
import '../../../../utils/styles/forms.sass'
import login from '../../../../assets/login.svg'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

const Recover = () => {
	const [email, setEmail] = useState('')

	const handleLogin = () => {
		console.log('Email:', email)
	}

	return <div id="intro">
		<div className="intro">
			<img className="background" src={login} />
			<div className="content login-form">
				<h2 style={{marginBottom: '24px'}}>Forgot password?</h2>
				<p>Enter your registered Email ID and we’ll send you a link to reset your password.</p>
				<div className="p-field">
					<label htmlFor="email">
						<InputText id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					</label>
				</div>
				<div className="p-field text-right" style={{marginBottom: '24px'}}>
					<Link className="text-xs" to="/login/">Login</Link>
				</div>
				<div className="p-field">
					<Button label="Send" onClick={handleLogin} />
				</div>
			</div>
		</div>
	</div>
}
export default Recover