import Cookies from "js-cookie"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Header from "@ui/header/Header"
import Intro from "@components/intro/Intro"
import { Pet, CreatePet } from "@modules/ngo"
import { Product, CreateProduct } from "@modules/vendor"
import Profile from "@components/modules/profile/Profile"
import { Forgot, Recover, LoginForm } from "@components/login"
import ThankYouPage from "@components/thankYouPage/ThankYouPage"
import { callNotifications, getUserData } from "@store/slices/usersSlice"
import { Map, Orders, Companies, Vendors, Shelters, Organizations } from "@modules/user"
import { RegisterRole, RegisterUser, RegisterCompany, RegisterVendor, RegisterNgo, RegisterAdmin } from "@components/register"
import { Dashboard, Notifications, Offers, OfferNew, Chats, Chat, Followers, Bookmarks, Settings, ProfileSettings, Password, Terms, Privacy, PrivacyPolicy, DeleteAccount, CreateReport, Users, Reports, Products, Pets, AdminOffers, ConfigureAds } from "@components/modules"


let notificationsSource = null;

const AppRoutes = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.userData)
  const notifications = useSelector((state) => state.users.notifications)

  const loadNotifications = () => {
    dispatch(callNotifications({user: user?.id}))
  }
  const initializeNotificationsSource = () => {
    if(notificationsSource)
      notificationsSource.close()
    notificationsSource = new EventSource(`https://earth-day-group.boldsample.com/php/notifications/${user?.id}`)
    notificationsSource.onmessage = e => loadNotifications()
    notificationsSource.onerror = (error) => console.error('EventSource error:', error)
  }
  const startNotificationsSource = () => {
    if(!notificationsSource)
      initializeNotificationsSource()
  }
  const stopNotificationsSource = () => {
    if(notificationsSource){
      notificationsSource.close()
      notificationsSource = null
    }
  }

  useEffect(() => {
    const _id = Cookies.get('edgActiveUser')
    if(!user?.id && _id != 'undefined' && user == null){
      dispatch(getUserData(_id))
    }else if(user?.id)
      startNotificationsSource()
    return () => stopNotificationsSource()
  }, [user])
  
	return <BrowserRouter basename="">
    <Header />
    <Routes>
      {!user?.role && <>
        <Route exact path="/" element={<Intro />} />
        <Route path="/register" element={<RegisterRole />} />
        <Route path="/register/user" element={<RegisterUser create={true} />} />
        <Route path="/register/company" element={<RegisterCompany create={true} />} />
        <Route path="/register/vendor" element={<RegisterVendor create={true} />} />
        <Route path="/register/ngo" element={<RegisterNgo create={true} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/recover/:token" element={<Recover />} />
      </> || <>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat" element={<Chats />} />
        <Route path="/chat/:contact" element={<Chat />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Followers followers={false} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/password" element={<Password />} />
        <Route path="/settings/privacy-policy/" element={<PrivacyPolicy />} />
        <Route path="/settings/deleteAccount" element={<DeleteAccount />} />
        <Route path="/report/:type/:entityID" element={<CreateReport />} />
      </>}

      {(user?.role == 'user') && <>
        <Route path="/companies" element={<Companies />} />
        <Route path="/offers/new" element={<OfferNew />} />
        <Route path="/company/:id" element={<Profile />} />
        <Route path="/market-place" element={<Vendors type="vendors" />} />
        <Route path="/vendor/:id" element={<Profile />} />
        <Route path="/products" element={<Vendors type="products" />} />
        <Route path="/products/saved" element={<Bookmarks type="products" />} />
        <Route path="/shelters" element={<Shelters type="shelters" />} />
        <Route path="/shelter/:id" element={<Profile />} />
        <Route path="/pets" element={<Shelters type="pets" />} />
        <Route path="/pets/favorite" element={<Bookmarks type="pets" />} />
        <Route path="/social-organizations" element={<Organizations type="organizations" />} />
        <Route path="/social-organizations/products" element={<Organizations type="products" />} />
        <Route path="/social/:id" element={<Profile />} />
        <Route path="/ngo/:id" element={<Profile />} />
        <Route path="/ngo/:id/pets" element={<Profile type="pets" />} />
        <Route path="/map" element={<Map />} />
        <Route path="/settings/edit" element={<RegisterUser />} />
      </>}
      {(user?.role == 'user' || user?.role == 'company') && <>
        <Route path="/offers" element={<Offers />} />
        <Route path="/chat/:contact/:offer" element={<Chat />} />
      </>}
      {(user?.role == 'user' || user?.role == 'vendor' || user?.role == 'social' || user?.role == 'ngo') && <>
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<Product />} />
      </>}
      {(user?.role == 'user' || user?.role == 'shelter' || user?.role == 'ngo') && <>
        <Route path="/pet/:id" element={<Pet />} />
      </>}
       {user?.role == 'company' && <>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/edit" element={<RegisterCompany />} />
       </>}
       {user?.role == 'vendor' && <>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/edit" element={<RegisterVendor />} />
       </>}
      {(user?.role == 'vendor' || user?.role == 'social' || user?.role == 'ngo') && <>
        <Route path="/product/new" element={<CreateProduct />} />
        <Route path="/product/:id" element={<CreateProduct />} />
      </>}
       {(user?.role == 'shelter' || user?.role == 'ngo') && <>
        <Route path="/pet/new" element={<CreatePet />} />
        <Route path="/pet/edit/:id" element={<CreatePet />} />
      </>}
       {(user?.role == 'ngo') && <>
        <Route path="/profile/pets" element={<Profile type="pets" />} />
      </>}
       {(user?.role == 'shelter' || user?.role == 'social' || user?.role == 'ngo') && <>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/edit" element={<RegisterNgo />} />
       </>}

      {(user?.role == 'admin') && <>
        <Route path="/admin/new" element={<RegisterAdmin create={true} />} />
        <Route path="/settings/edit" element={<RegisterAdmin />} />
        <Route path="/admin/edit/:username" element={<RegisterAdmin />} />
        <Route path="/user/edit/:username" element={<RegisterUser />} />
        <Route path="/company/edit/:username" element={<RegisterCompany />} />
        <Route path="/vendor/edit/:username" element={<RegisterVendor />} />
        <Route path="/ngo/edit/:username" element={<RegisterNgo />} />
        <Route path="/admins" element={<Users type="admins" />} />
        <Route path="/users" element={<Users type="users" />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/chat/:contact/:report" element={<Chat />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product/edit/:id" element={<CreateProduct />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pet/:id" element={<Pet />} />
        <Route path="/pet/edit/:id" element={<CreatePet />} />
        <Route path="/offers" element={<AdminOffers />} />
        <Route path="/ads" element={<ConfigureAds />} />
      </>}
      <Route path="/thankyou" element={<ThankYouPage />} />
      <Route path="/terms-of-service/" element={<Terms />} />
      <Route path="/privacy-policy/" element={<PrivacyPolicy />} />

      {!user?.role && 
        <Route path="*" element={<LoginForm />} />
      || 
        <Route path="*" element={<Dashboard />} />
      }
    </Routes>
  </BrowserRouter>
}

export default AppRoutes