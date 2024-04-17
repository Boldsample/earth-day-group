import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	error: "",
	addLink: "",
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
	setHeader,
	resetState,
	isSettings,
	headerTitle,
	updateAddLink,
	updateThankyou,
	setHeaderTitle,
} = globalSlice.actions;

export default globalSlice.reducer