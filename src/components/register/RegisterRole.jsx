import { Link } from "react-router-dom"

import Card from "@ui/cards/Card"
import userRoles from '@json/roles.json'
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton"

const RegisterRole = () => {
	return <div className="layout">
		<img className="layout__background" src="/assets/register/image-1.svg" />
		<div className="main__content fullwidth">
			<h2 className="text-center mb-4 mr-8">Register as:</h2>
			<div className="card__grid">
				{userRoles.length > 0 ? userRoles.map((role, key) => <Link key={key} to={role.link}>
					<Card
						icon={role.icon}
						title={role.title}
						cardStyle={role.className}
						description={role.description}
					/>
				</Link>) : "No roles found."}
			</div>
		</div>
		<Link to="/"><GoBackButton/></Link>
	</div>
}

export default RegisterRole