import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { getJSON } from "@utils/useJSON"
import { getNotifications, getUser, getUsers } from "@services/userServices"

const initialState = {
  loading: false,
  error: "",
  userData: {},
  usersList: [],
  cleanData: [],
  inputField: "",
  notifications: [],
}

export const getUsersList = createAsyncThunk("users/getUsersList", async () => {
  const res = await getUsers();
  return res;
})

export const getUserData = createAsyncThunk("users/getUserData", async (id) => {
  const res = await getUser(id);
  delete res.password
  delete res.password_confirmation
  return res;
})

export const callNotifications = createAsyncThunk("users/notifications", async (data) => {
  const res = await getNotifications(data)
  console.log(res)
  return res;
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUser: (state, action) => state.userData = { ...action.payload },
    resetState: (state) => initialState,
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
      if (action.error.code) state.error = action.error.code;
    });
    builder.addCase(callNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
  },
});

export const {
  captureInputData,
  updateUser,
  addCleanData,
  addUserList,
  resetState,
  storeUserRegistrationData,
} = usersSlice.actions;

export default usersSlice.reducer;
