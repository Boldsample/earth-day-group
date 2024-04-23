import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { getJSON } from "@utils/useJSON"
import { createOffer } from "@services/offersServices";
// import { getUser, getUsers } from "@services/userServices"

const initialState = {
	loading: false,
	error: "",
	offersList: [],
};

export const createNewOffer = createAsyncThunk("offers/createNewOffer", async (table, data) => {
	const res = await createOffer(table, data);
	return res;
});
export const getUserData = createAsyncThunk(
	"users/getUserData",
	async () => {
		const res = await getUser();
		return res;
	}
)
const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {
		captureInputData: (state, action) => {
			state.inputField = action.payload;
		},
		updateUser: (state, action) => {
			state.userData = { ...action.payload };
		},
		addOffer : (state, action) => {
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
		// builder.addCase(getUsersList.pending, (state) => {
		// state.loading = true;
		// });
		// builder.addCase(getUsersList.fulfilled, (state, action) => {
		// state.loading = false;
		// state.usersList = action.payload;
		// });
		// builder.addCase(getUsersList.rejected, (state, action) => {
		// state.loading = false;
		// if (action.error.code) {
		// 	state.error = action.error.code;
		// }
		// });
	},
})

export const {
	addOffer
} = offersSlice.actions;

export default offersSlice.reducer