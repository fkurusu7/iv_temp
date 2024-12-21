import { persistReducer, persistStore } from "redux-persist";
import userAuthReducer from "./userAuthSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

// Set persist config for userAuth Slice
const userPersistConfig = {
  key: "userAuth",
  storage,
  version: 1,
  // whitelist specific fields to persist. Only persist currentUser, not loading and error states
  whitelist: ["currentUser"],
};

// Persist individual reducer
const persistedUserReducer = persistReducer(userPersistConfig, userAuthReducer);

// Combine the persisted reducers
const rootReducer = combineReducers({
  user: persistedUserReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types from serializable check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
