import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { followUser, getNotifications, getUser, getUsers, updateUser } from "@services/userServices"

const initialState = {
  loading: false,
  error: "",
  usersList: [],
  cleanData: [],
  userData: null,
  inputField: "",
  notifications: [],
}

export const getUsersList = createAsyncThunk("users/getUsersList", async (filter) => {
  const res = await getUsers(filter, 'full');
  return res;
})

export const getUserData = createAsyncThunk("users/getUserData", async (id) => {
  const res = await getUser(id);
  delete res.password
  delete res.password_confirmation
  return res;
})

export const updateUserData = createAsyncThunk("users/updateUserData", async ({data, filter}) => {
  const _res = await updateUser(data, filter)
  const res = await getUser(_res?.id);
  delete res.password
  delete res.password_confirmation
  return res;
})
export const followUserData = createAsyncThunk("users/followUser", async (data) => {
  const _id = await followUser(data)
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
  const res = await getNotifications(data, 6)
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
    //updateUser: (state, action) => state.userData = { ...action.payload },
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
    builder.addCase(followUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builder.addCase(callNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
  },
});

export const {
  resetState,
  addUserList,
  addCleanData,
  captureInputData,
  storeUserRegistrationData,
} = usersSlice.actions;

export default usersSlice.reducer;
