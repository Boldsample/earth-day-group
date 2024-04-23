import { configureStore } from "@reduxjs/toolkit"

import { globalReducer, usersReducer, offersReducer } from "./slices"


const store = configureStore({
	reducer: {
		users: usersReducer,
		global: globalReducer,
		offers: offersReducer
	},
});

export default store;