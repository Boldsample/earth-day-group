import { configureStore } from "@reduxjs/toolkit";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store/store";
import Header from "./Header";
import Intro from "../modules/static/pages/Intro";

const App = () => {
  return (
    <Provider store={store}>
      <PrimeReactProvider>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Intro />} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
      //{" "}
    </Provider>
  );
};
export default App;
