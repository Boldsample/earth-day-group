import { createSlice } from "@reduxjs/toolkit";
import { getUser, getUsers } from "../../services/userServices";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
  inputField: "",
  userData: {},
  usersList: [],
  cleanData: [],
};

export const getUsersList = createAsyncThunk("users/getUsersList", async () => {
  // console.log(inputField)
  const res = await getUsers();
  return res;
});

export const getUserData = createAsyncThunk(
  "users/getUserData",
  async (name) => {
    const res = await getUser(name);
    return res;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    captureInputData: (state, action) => {
      state.inputField = action.payload;
    },
    addUser: (state, action) => {
      state.userData = { ...action.payload };
    },
    addUserList: (state, action) => {
      state.usersList = [...action.payload];
    },
    addCleanData: (state, action) => {
      state.cleanData = action.payload;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsersList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, action) => {
      state.loading = false;
      state.usersList = action.payload;
    });
    builder.addCase(getUsersList.rejected, (state, action) => {
      state.loading = false;
      if (action.error.code) {
        state.error = action.error.code;
      }
    });
    builder.addCase(getUserData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.loading = false;
      if (action.error.code) {
        state.error = action.error.code;
      }
    });
  },
});

export const {
  captureInputData,
  addUser,
  addCleanData,
  addUserList,
  resetState,
} = usersSlice.actions;

export default usersSlice.reducer;
