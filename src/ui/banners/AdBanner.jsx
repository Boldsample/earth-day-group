import { getAd } from "@services/adsServices"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const AdBanner = ({location, type}) => {
    const user = useSelector(state => state.users.userData)
    console.log(user.role)
    const [adInfo, setAdInfo] = useState(null)
    useEffect(()=>{
        getAd(type).then(data => {
            console.log(data, user.role)
            if(data.target.split(", ").some(target => target == user.role))
            setAdInfo(data)
        })
    }, [user])
    console.log(adInfo)
    if(adInfo == null)
    return null
    const renderBanner = () => {
      switch (type) {
        case 'headerBanner':
          return <img src={adInfo.picture} alt="" />;
          case 'dashboardButton':
          return  <img src={adInfo.picture} alt="" />;;
        default:
          return 
      }
    };
  return (
    <div>
        {renderBanner()}
    </div>
  )
}

export default AdBanner


