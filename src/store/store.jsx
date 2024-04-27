import { configureStore } from "@reduxjs/toolkit"

import { globalReducer, usersReducer } from "./slices"


const store = configureStore({
	reducer: {
		users: usersReducer,
		global: globalReducer,
		
	},
});

export default store;