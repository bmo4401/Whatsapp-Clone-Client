'use client';
import { PayloadAction, combineReducers, createSlice } from '@reduxjs/toolkit';
import { StaticImageData } from 'next/image';
import { RootState } from '../store';
// Type for our state

export type UserState = {
   id: string | number;
   email: string;
   name: string;
   profileImage: string | StaticImageData;
   about?: string;
   status?: string;
   isNew: boolean;
   contactSearch?: string;
   contactPage?: boolean;
   messageSearch?: boolean;
};

/* Persist */

// Initial state
const initialUserState: UserState = {
   id: '',
   email: '',
   name: '',
   profileImage: '',
   status: '',
   about: '',
   isNew: false,
   contactPage: false,
};

// Actual Slice
export const userSlice = createSlice({
   name: 'user',
   initialState: initialUserState,
   reducers: {
      // Action to set the authentication status
      setUser(state, action: PayloadAction<UserState>) {
         return action.payload;
      },
      setContact(state) {
         return {
            ...state,
            contactPage: !state.contactPage,
         };
      },
      setMessageSearch(state) {
         return {
            ...state,
            messageSearch: !state.messageSearch,
         };
      },
      setSignOut(state) {
         return initialUserState;
      },
   },
});

export const { setUser, setContact, setMessageSearch, setSignOut } =
   userSlice.actions;

export const userSelector = (state: RootState) =>
   state.persistedReducer.userReducer;

export default userSlice.reducer;
