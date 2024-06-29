import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  error: "",
  thankyou: {},
  loading: false,
  header: 'false',
  headerTitle: '',

};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    setHeaderTitle: (state, action) => {
      state.headerTitle = action.payload;
    },
    updateThankyou: (state, action) => {
      state.thankyou = { ...action.payload };
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
  headerTitle,
  loadingData,
  updateThankyou,
  setHeaderTitle,
} = globalSlice.actions;

export default globalSlice.reducer