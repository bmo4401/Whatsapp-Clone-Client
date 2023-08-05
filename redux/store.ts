import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user-slice';
import messagesReducer from './features/messages-slice';
import callReducer from './features/call-slice';
import contactReducer from './features/contact-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistUserConfig = {
   key: 'user',
   storage,
};
const persistedReducer = persistReducer(
   persistUserConfig,
   combineReducers({ userReducer, contactReducer }),
);

export const store = configureStore({
   reducer: {
      persistedReducer,
      messagesReducer,
      callReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
