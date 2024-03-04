import { configureStore } from "@reduxjs/toolkit"
import { PrimeReactProvider } from "primereact/api"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "../../store/store"
import Header from "./Header"
import Intro from "../modules/static/pages/Intro"
import Recover from "../modules/login/pages/Recover"
import LoginForm from "../modules/login/pages/LoginForm"

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
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
      //{" "}
    </Provider>
  );
};
export default App