import '..//ui/style.sass'
import '../../static/ui/style.sass'
import '../../../../utils/styles/forms.sass'
import login from '../../../../assets/login.svg'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = () => {
		console.log('Email:', email)
		console.log('Contraseña:', password)
	}

	return <div id="intro">
		<div className="intro">
			<img className="background" src={login} />
			<div className="content login-form">
				<h2>Login to your account</h2>
				<div className="p-field" style={{marginBottom: '24px'}}>
					<label htmlFor="email">
						<InputText id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					</label>
				</div>
				<div className="p-field">
					<label htmlFor="password">
						<InputText id="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
						/>
					</label>
				</div>
				<div className="p-field text-right" style={{marginBottom: '24px'}}>
					<Link className="text-xs" to="/recover/">Forgot password?</Link>
				</div>
				<div className="p-field" style={{marginBottom: '24px'}}>
					<Button label="Login" onClick={handleLogin} />
				</div>
				<div className="p-field">
					<p className="text-center" style={{fontSize: '16px'}}>Or sign in with</p>
					<GoogleOAuthProvider clientId="510464940348-562le9obed61s1a4gk8clo1gh809lhvu.apps.googleusercontent.com">
						<GoogleLogin onSuccess={credentialResponse => { console.log(credentialResponse); }} onError={() => { console.log('Login Failed'); }} />
					</GoogleOAuthProvider>
				</div>
			</div>
		</div>
	</div>
}
export default LoginForm