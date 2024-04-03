import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	error: "",
	addLink: "",
	thankyou: {},
	loading: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		updateAddLink: (state, action) => {
			state.addLink = action.payload;
		},
		updateThankyou: (state, action) => {
			state.thankyou = { ...action.payload };
		},
		resetState: (state) => {
			return initialState;
		},
	}
})

export const {
	addLink,
	resetState,
	updateAddLink,
	updateThankyou,
} = globalSlice.actions;

export default globalSlice.reducer