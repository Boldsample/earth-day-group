import Header from "./layout/Header";
import store from "@store/store";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "@modules/intro/Intro";
import Recover from "@modules/login/Recover";
import LoginForm from "@modules/login/LoginForm";
import RegisterUser from "@modules/register/registerUser/RegisterUser";
import RegisterCategories from "@modules/register/registerCategories/RegisterCategories";

const App = () => {
  return (
    <Provider store={store}>
      <PrimeReactProvider>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Intro />} />
						<Route path="/login/" element={<LoginForm />} />
						<Route path="/recover/" element={<Recover />} />
						<Route exact path="/register/categories/" element={<RegisterCategories />} />
						<Route exact path="/register/user/" element={<RegisterUser/>} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </Provider>
  );
};
export default App;
