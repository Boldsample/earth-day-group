import { setDefaults, fromAddress } from "react-geocode"

const useGeolocalization = () => {
	setDefaults({
		region: "US",
		language: "en",
		key: "AIzaSyA6Ml_ldHM_SaImawJPIitRZ8T-EJGl2VI",
	})
	return { fromAddress }
}

export default useGeolocalization