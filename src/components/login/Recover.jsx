import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from 'primereact/button'
import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'

import { setHeader } from '@store/slices/globalSlice'

const Recover = () => {
	const dispatch = useDispatch()
	const [email, setEmail] = useState('')

	const handleLogin = () => {
		console.log('Email:', email)
	}

	useEffect(() => {
		dispatch(setHeader('login'))
	}, [])

	return <div>
		<div className="layout">
			<img className="layout__background" src="/assets/login/image-1.svg" />
			<div className="main__content login-form">
				<h1 className="text-upperCase mb-1">Forgot password?</h1>
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