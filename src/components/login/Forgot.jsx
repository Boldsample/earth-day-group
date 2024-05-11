import { useDispatch } from 'react-redux'
import { Button } from 'primereact/button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'

import { setHeader } from '@store/slices/globalSlice'

const Forgot = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [email, setEmail] = useState('')
	const [sending, setSending] = useState(false)

	const handleLogin = async () => {
		navigate('/recover/?token='+email)
	}

	useEffect(() => {
		dispatch(setHeader('register'))
	}, [])

	return <div>
		<div className="layout">
			<img className="layout__background" src="/assets/login/image-1.svg" />
			<div className="main__content login-form">
				<h1 className="text-upperCase mb-1">Forgot password?</h1>
				<p>Enter your registered Email ID and we’ll send you a link to reset your password.</p>
				<div className="p-field mb-1">
					<label htmlFor="email">
						<InputText id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					</label>
				</div>
				<div className="p-field">
					<Button className="dark-blue fullwidth" label="Send" onClick={handleLogin} loading={sending} />
				</div>
			</div>
		</div>
	</div>
}
export default Forgot