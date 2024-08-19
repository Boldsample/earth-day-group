import { getAd } from "@services/adsServices"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import'./styles.sass'
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
          return <div className="horizontal-banner-container">
            <img src={adInfo.picture} alt="" />
          </div>
          case 'dashboardButton':
          return  <img src={adInfo.picture} alt="" />
        default:
          return 
      }
    };
  return (
    <>
        {renderBanner()}
    </>

  )
}

export default AdBanner


