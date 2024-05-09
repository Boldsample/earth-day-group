import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getOffers } from '@services/offersServices'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const Offers = () => {
  const dispatch = useDispatch()
  const [offers, setOffers] = useState([])
  const user = useSelector((state) => state.users.userData)

  const callOffers = async () =>{
    let _filter
    if(user.role == 'user'){
      _filter = { user: user.id }
    }else{
      let _materials = []
      user.materials.map(material => { _materials.push(material.type) })
      _filter = "`material`='" + _materials.join("' OR `material`='") +"'"
    }
    const _offers = await getOffers(_filter)
    setOffers(_offers)
  }

  useEffect(() => {
    callOffers()
    dispatch(setHeader('user'))
    if(user.role == 'user')
      dispatch(updateAddLink('/offers/new/'))
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content halfspace halfwidth">
      <h1 className='text-defaultCase'>Offers</h1>
      {offers?.length ? 
        offers?.map(offer => <MultiUseCard 
          offer={offer}
          key={offer.id}
          type={user.role == 'user' ? 'offer' : 'offer_company'} />) : 
        <div className="mt-2">
          <p>{user.role == 'user' ? "You didn’t post any offer yet." : "There's no offers for the materials you buy"}</p>
          {user.role == 'user' && 
            <Link className="button dark-blue mt-1" to="/offers/new">Create post offer</Link>
          }
        </div>
      }
    </div>
  </div>
}

export default Offers