import store from "@store/store";
import Header from "@ui/header/Header";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "@components/intro/Intro";
import Recover from "@components/login/Recover";
import LoginForm from "@components/login/LoginForm";
import RegisterUser from "@components/register/registerUser/RegisterUser";
import RegisterCategories from "@components/register/registerCategories/RegisterCategories";
import RegisterThankYouPage from "@components/register/registerThankYouPage/RegisterThankYouPage";
import Dashboard from "./modules/user/dashboard/Dashboard";
import Notifications from "./modules/user/notifications/Notifications";
import OffersList from "./modules/user/offers/OffersList";
import 'primeicons/primeicons.css';
        

const App = () => {
  return (
    <Provider store={store}>
      <PrimeReactProvider>
        <BrowserRouter>
          <Header />
          {/* <RegisterThankYouPage /> */}
          <Routes>
            <Route exact path="/" element={<Intro />} />
            <Route path="/login/" element={<LoginForm />} />
            <Route path="/recover/" element={<Recover />} />
            <Route
              exact
              path="/register/categories/"
              element={<RegisterCategories />}
            />
            <Route exact path="/register/user/" element={<RegisterUser />} />
            <Route exact path="/dashboard/" element={<Dashboard />} />
            <Route exact path="/dashboard/notifications" element={<Notifications />} />
            <Route exact path="/dashboard/Offerslist" element={<OffersList />} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </Provider>
  );
};
export default App;
