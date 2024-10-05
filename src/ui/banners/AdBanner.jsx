import { getAd } from "@services/adsServices"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import'./styles.sass'
const AdBanner = ({location, type}) => {
  const user = useSelector(state => state.users.userData)
  const [adInfo, setAdInfo] = useState(null)
  useEffect(()=>{
    getAd(type).then(data => {
      if(data.target.split(", ").some(target => target == user.role))
      setAdInfo(data)
  })
}, [user])
    if(adInfo == null)
    return null
    const renderBanner = () => {
      switch (type) {
        case 'headerBanner':
          return <div className="horizontal-banner-container">
             <Link to={ adInfo.link } target="_blank"><img src={adInfo.picture} alt="" /></Link>
          </div>
          case 'dashboardButton':
          return  <Link to={ adInfo.link } target="_blank"><img style={{borderRadius: "0.5rem"}} src={adInfo.picture} alt="" /></Link>
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


