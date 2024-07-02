import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {  getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import ProfileListing from "@ui/templates/ProfileListing/ProfileListing"

import "./profile.sass"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const profileTemplateContent = {
    title: 'MARKET PLACE',
    searchLabel: 'Discover products',
    bannerImage: 'url(/assets/user/image-7.svg)',
    types: [
      {
        card: 'company',
        url: '/vendors/',
        label: 'Vendors',
      },
      {
        card: 'product',
        label: 'Products',
        url: '/products/',
      },
    ],
    secondary: [
      {
        title: '100% Recycled',
        icon: '/assets/icons/recycleCompanyIcon1.svg',
      },
      {
        title: 'Eco Friendly',
        icon: '/assets/icons/recycleCompanyIcon2.svg',
      },
      {
        title: 'Sustainable Economy',
        icon: '/assets/icons/recycleCompanyIcon3.svg',
      },
    ]
  }

  const loadProfile = async () => {
    const _profile = await getUser(id, user?.id)
    setProfile(_profile)
  }
  
  useEffect(() => {
    if(profile == null && id)
      loadProfile()
    else if(profile == null)
      setProfile(user)
		dispatch(setHeader('user'))
  }, [])

  return <ProfileListing content={profileTemplateContent} same={id} profile={profile} />
}

export default Profile