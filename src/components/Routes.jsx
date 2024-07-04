import Cookies from "js-cookie"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Header from "@ui/header/Header"
import { CreatePet } from "@modules/ngo"
import Intro from "@components/intro/Intro"
import { getUserData } from "@store/slices/usersSlice"
import { Product, CreateProduct } from "@modules/vendor"
import Profile from "@components/modules/profile/Profile"
import { Forgot, Recover, LoginForm } from "@components/login"
import ThankYouPage from "@components/thankYouPage/ThankYouPage"
import { Dashboard, Map, Orders, Companies, Vendors, Shelters, Organizations } from "@modules/user"
import { RegisterRole, RegisterUser, RegisterCompany, RegisterVendor, RegisterNgo } from "@components/register"
import { Notifications, Offers, OfferNew, Chats, Chat, Followers, Bookmarks, Settings, ProfileSettings, Password, Terms, About, Activity } from "@modules"



const AppRoutes = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.userData)
  const thankyou = useSelector((state) => state.global.thankyou)

  useEffect(() => {
    const _id = Cookies.get('edgActiveUser')
    if(!user?.id && _id != 'undefined')
      dispatch(getUserData(_id))
  }, [])
  
	return <BrowserRouter>
    <Header />
    <Routes>
      {/*   NO LOGGED USER    */}
      {!user.role && <>
        <Route exact path="/" element={<Intro />} />
        <Route exact path="/register" element={<RegisterRole />} />
        <Route exact path="/register/user" element={<RegisterUser />} />
        <Route exact path="/register/company" element={<RegisterCompany />} />
        <Route exact path="/register/vendor" element={<RegisterVendor />} />
        <Route exact path="/register/ngo" element={<RegisterNgo />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/recover" element={<Recover />} />
      </>}

      {/*   USER    */}
      {user.role == 'user' && <>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/offers" element={<Offers />} />
        <Route exact path="/offers/new" element={<OfferNew />} />
        <Route exact path="/chat" element={<Chats />} />
        <Route exact path="/chat/:contact" element={<Chat />} />
        <Route exact path="/location" element={<Map />} />
        <Route exact path="/orders" element={<Orders />} />
        <Route exact path="/followers" element={<Followers />} />
        <Route exact path="/following" element={<Followers followers={false} />} />
        <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/settings/profile" element={<ProfileSettings />} />
        <Route exact path="/settings/password" element={<Password />} />
        <Route exact path="/settings/edit" element={<RegisterUser />} />
        <Route exact path="/settings/terms" element={<Terms />} />
        <Route exact path="/settings/about" element={<About />} />
        <Route exact path="/settings/activity" element={<Activity />} />
        <Route exact path="/companies" element={<Companies />} />
        <Route exact path="/company/:id" element={<Profile />} />
        <Route exact path="/market-place" element={<Vendors type="vendors" />} />
        <Route exact path="/vendor/:id" element={<Profile />} />
        <Route exact path="/products" element={<Vendors type="products" />} />
        <Route exact path="/product/:id" element={<Product />} />
        <Route exact path="/products/saved" element={<Bookmarks type="products" />} />
        <Route exact path="/shelters" element={<Shelters type="shelters" />} />
        <Route exact path="/pets" element={<Shelters type="pets" />} />
        <Route exact path="/pets/favorite" element={<Bookmarks type="pets" />} />
        <Route exact path="/social-organizations" element={<Organizations type="organizations" />} />
        <Route exact path="/social-organizations/products" element={<Organizations type="products" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </>}

      {/*   COMPANY   */}
      {user.role == 'company' && <>
        <Route exact path="/dashboard/" element={<Offers />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/profile/" element={<Profile />} />
        <Route exact path="/chat" element={<Chats />} />
        <Route exact path="/chat/:contact" element={<Chat />} />
        <Route exact path="/chat/:contact/:offer/" element={<Chat />} />
        <Route exact path="/followers" element={<Followers />} />
        <Route exact path="/following" element={<Followers followers={false} />} />
        <Route exact path="/settings/" element={<Settings />} />
        <Route exact path="/settings/profile/" element={<ProfileSettings />} />
        <Route exact path="/settings/password/" element={<Password />} />
        <Route exact path="/settings/edit/" element={<RegisterCompany />} />
        <Route exact path="/settings/terms/" element={<Terms />} />
        <Route exact path="/settings/about/" element={<About />} />
        <Route exact path="/settings/activity/" element={<Activity />} />
        <Route path="*" element={<Navigate to="/dashboard/" />} />
      </>}

      {/*   VENDOR   */}
      {user.role == 'vendor' && <>
        <Route exact path="/dashboard/" element={<Profile />} />
        <Route exact path="/chat" element={<Chats />} />
        <Route exact path="/chat/:contact" element={<Chat />} />
        <Route exact path="/followers" element={<Followers />} />
        <Route exact path="/following" element={<Followers followers={false} />} />
        <Route exact path="/product/:id" element={<Product />} />
        <Route exact path="/product/new" element={<CreateProduct />} />
        <Route exact path="/settings/" element={<Settings />} />
        <Route exact path="/settings/profile/" element={<ProfileSettings />} />
        <Route exact path="/settings/password/" element={<Password />} />
        <Route exact path="/settings/edit/" element={<RegisterCompany />} />
        <Route exact path="/settings/terms/" element={<Terms />} />
        <Route exact path="/settings/about/" element={<About />} />
        <Route exact path="/settings/activity/" element={<Activity />} />
        <Route path="*" element={<Navigate to="/dashboard/" />} />
      </>}
      <Route exact path="/pet/new" element={<CreatePet />} />
       {/*   NGO   */}
       {user.role == 'ngo' && <>
        <Route exact path="/pet/new" element={<CreatePet />} />
      </>}

      <Route path="/thankyou" element={<ThankYouPage />} />
      {user?.id && thankyou.title && 
        <Route path="*" element={<Navigate to="/thankyou/" />} />}
      <Route path="*" element={<LoginForm />} />
    </Routes>
  </BrowserRouter>
}

export default AppRoutes