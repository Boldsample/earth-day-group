import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import "./goBackButton.sass"

const GoBackButton = () => {
	return <div className='goBackButton__container'>
		<button><FontAwesomeIcon icon={faChevronLeft}/></button>
	</div>
}
export default GoBackButton