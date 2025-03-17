import Cookies from "js-cookie"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  error: "",
  thankyou: {},
  prevPage: [],
  loading: false,
  header: 'false',
  headerTitle: '',
  currency: Cookies.get("edgUserCurrency") || "usd"
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setPrevPage: (state, action) => {
      const nextPath = action.payload;
      console.log(state.prevPage?.at(-1), nextPath)
      if (Array.isArray(state.prevPage) && state.prevPage?.at(-2) === nextPath)
        state.prevPage = [...state.prevPage].slice(0, -1)
      else
        state.prevPage = [...state.prevPage, nextPath]
    },
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    setHeaderTitle: (state, action) => {
      state.headerTitle = action.payload;
    },
    updateThankyou: (state, action) => {
      state.thankyou = { ...action.payload };
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      Cookies.set("edgUserCurrency", action.payload);
    },
    resetState: (state) => {
      return initialState;
    },
    loadingData: (state, action) =>{
      state.loading = action.payload
    }
  }
})

export const {
  setHeader,
  resetState,
  isSettings,
  setPrevPage,
  headerTitle,
  loadingData,
  setCurrency,
  updateThankyou,
  setHeaderTitle,
} = globalSlice.actions;

export default globalSlice.reducer