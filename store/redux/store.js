import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import favoriteReducer from "./favorites";

const persistConfig = {
  key: "root",
  storage
}

const persistedReducer = persistReducer(persistConfig, favoriteReducer)

export const store = configureStore({
  reducer: {
    favoriteItems: persistedReducer
  }
});

export const persistor = persistStore(store)