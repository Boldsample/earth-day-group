import { getAd } from "@services/adsServices"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Ad = ({location, type}) => {
    const user = useSelector(state => state.users.userData)
    console.log(user.role)
    const [adInfo, setAdInfo] = useState(null)
    useEffect(()=>{
        getAd(type).then(data => {
            if(data.target.split(", ").some(target => target == user.role))
            setAdInfo(data)
        })
    }, [user])
    if(adInfo == null)
    return null
  return (
    <div>
        <img src={adInfo.picture} alt="" />
    </div>
  )
}

export default Ad