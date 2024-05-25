import { useSelector } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Intro from "@components/intro"
import Header from "@ui/header/Header"
import Profile from "@modules/company/profile/Profile"
import { Forgot, Recover, LoginForm } from "@components/login"
import ThankYouPage from "@components/thankYouPage/ThankYouPage"
import { Dashboard, Map, Orders, Companies, Vendors } from "@modules/user"
import { RegisterRole, RegisterUser, RegisterCompany, RegisterVendor } from "@components/register"
import { Notifications, Offers, OfferNew, Chat, Settings, ProfileSettings, Terms, About, Activity } from "@modules"

const AppRoutes = () => {
  const role = useSelector((state) => state.users.userData?.role)
  
	return <BrowserRouter>
    <Header />
    <Routes>
      {/*   NO LOGGED USER    */}
      <Route exact path="/" element={<Intro />} />
      <Route exact path="/register" element={<RegisterRole />} />
      <Route exact path="/register/user" element={<RegisterUser />} />
      <Route exact path="/register/company" element={<RegisterCompany />} />
      <Route exact path="/register/vendor" element={<RegisterVendor />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/thankyou" element={<ThankYouPage />} />

      {/*   USER    */}
      {role == 'user' && <>
        <Route exact path="/dashboard/" element={<Dashboard />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/offers" element={<Offers />} />
        <Route exact path="/offers/new" element={<OfferNew />} />
        <Route exact path="/offers/new" element={<Chat />} />
        <Route exact path="/chat" element={<Chat />} />
        <Route exact path="/chat/:contact" element={<Chat />} />
        <Route exact path="/location" element={<Map />} />
        <Route exact path="/orders/" element={<Orders />} />
        <Route exact path="/settings/" element={<Settings />} />
        <Route exact path="/settings/profile/" element={<ProfileSettings />} />
        <Route exact path="/settings/edit/" element={<RegisterUser />} />
        <Route exact path="/settings/terms/" element={<Terms />} />
        <Route exact path="/settings/about/" element={<About />} />
        <Route exact path="/settings/activity/" element={<Activity />} />
        <Route exact path="/companies/" element={<Companies />} />
        <Route exact path="/company/:id" element={<Profile />} />
        <Route exact path="/vendors/" element={<Vendors />} />
      </>}

      {/*   COMPANY   */}
      {role == 'company' && <>
        <Route exact path="/dashboard/" element={<Offers />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/profile/" element={<Profile />} />
        <Route exact path="/settings/" element={<Settings />} />
		<Route exact path="/settings/profile/" element={<ProfileSettings />} />
		<Route exact path="/settings/edit/" element={<RegisterCompany />} />
		<Route exact path="/settings/terms/" element={<Terms />} />
		<Route exact path="/settings/about/" element={<About />} />
		<Route exact path="/settings/activity/" element={<Activity />} />
      </>}
    </Routes>
  </BrowserRouter>
}

export default AppRoutes