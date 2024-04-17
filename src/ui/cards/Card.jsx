import "./style.sass"

const Card = ({
	icon,
	title,
	cardStyle,
	description,
}) => {
	return <div className={`card ${cardStyle}`}>
		<div className="card__icon">
			<img src={icon} alt="Category Icon" />
		</div>
		<h4>{title}</h4>
		<h5>{description}</h5>
	</div>
}
export default Card