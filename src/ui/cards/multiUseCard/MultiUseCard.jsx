import { Button } from "primereact/button"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./multiusecard.sass"
import companyLogo from "@assets/test-img.png"

const MultiUseCard = ({
	type,
	date,
	title,
	price,
	offers,
	receive,
	material,
	quantity,
	description,
	offer,
	orderStatus,
}) => {
const renderCardContent = () => {
	switch (type) {
	case "notification":
		return (
		<>
			<div className="notification__header">
			<div className="notification__title">
				<FontAwesomeIcon icon={faBell} />
				<h4 className="font-bold">{title}</h4>
			</div>
			<div className="notification__date">
				<small>{date}</small>
			</div>
			</div>
			<div className="notification__Body">
			<p className="multiuseCard__p">{description}</p>
			</div>
		</>
		);
	case "offer":
		return <div className="main__container">
			<img className="offer__image" src={companyLogo} alt={title} />
			<div>
				<h4 className="font-bold text-gray">{title}</h4>
				{material.map((m, key) => <Button key={key} label={m} className="small green-earth" />)}
				<div className="flex">
					<table>
						<thead>
							<tr>
								<th>Quantity</th>
								<th>Asking Price</th>
								<th>Offers</th>
								<th>Receive</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{quantity}</td>
								<td>{price}</td>
								<td>{offers}</td>
								<td>{receive ? <i className="pi pi-eye" /> : null }</td>
							</tr>
						</tbody>
					</table>
					<p className="date">{date}</p>
				</div>
			</div>
			{/* <div className="offer__container">
			<div className="left__container">
				<div className="offer__mainInfo">
				<h4>{title}</h4>
				<p
					className={`${
					orderStatus == "Pending"
						? "text-pending"
						: "" || orderStatus == "Aproved"
						? "text-aproved"
						: "text-rejected"
					} multiuseCard__p`}
				>
					{description}
				</p>
				<small>{offer}</small>
				</div>
			</div>
			<div className="offer__status">
				<div>
				<span
					className={`${
					orderStatus == "Pending"
						? "--pending"
						: "" || orderStatus == "Aproved"
						? "--aproved"
						: "--rejected"
					} offerCircle__status`}
				></span>
				<small>{date}</small>
				</div>
				<small
				className={
					orderStatus == "Pending"
					? "text-pending"
					: "" || orderStatus == "Aproved"
					? "text-aproved"
					: "text-rejected"
				}
				>
				{orderStatus}
				</small>
			</div>
			</div> */}
		</div>
	default:
		return null;
	}
};

return <div className="multiUse__card">{renderCardContent()}</div>;
};

export default MultiUseCard;
