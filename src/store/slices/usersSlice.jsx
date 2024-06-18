import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { followUser, getNotifications, getUser, getUsers, updateUser as updateUserD } from "@services/userServices"

const initialState = {
  loading: false,
  error: "",
  userData: {},
  usersList: [],
  cleanData: [],
  inputField: "",
  notifications: [],
}

export const getUsersList = createAsyncThunk("users/getUsersList", async (filter) => {
  const res = await getUsers(filter);
  return res;
})

export const getUserData = createAsyncThunk("users/getUserData", async (id) => {
  const res = await getUser(id);
  delete res.password
  delete res.password_confirmation
  return res;
})

export const updateUserData = createAsyncThunk("users/updateUserData", async ({data, filter}) => {
  const _id = await updateUserD(data, filter)
  const res = await getUser(_id);
  delete res.password
  delete res.password_confirmation
  return res;
})

export const callNotifications = createAsyncThunk("users/notifications", async (data) => {
  const info = {
    offer: { title: 'New offer', message: 'sent you a offer.' },
    message: { title: 'New message', message: 'sent you a message.' },
  }
  const res = await getNotifications(data)
  const _res = res.map(notification => {
    const {title, message} = info[notification.type]
    let _notification = {...notification}
    _notification.title = title
    _notification.message = message
    return _notification
  })
  return _res;
})

const usersSlice = createSlice({
  initialState,
  name: "users",
  reducers: {
    resetState: state => { return {...initialState} },
    updateUser: (state, action) => state.userData = { ...action.payload },
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
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builder.addCase(callNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
  },
});

export const {
  updateUser,
  resetState,
  addUserList,
  addCleanData,
  captureInputData,
  storeUserRegistrationData,
} = usersSlice.actions;

export default usersSlice.reducer;
