'use client';
import { PayloadAction, combineReducers, createSlice } from '@reduxjs/toolkit';
import { StaticImageData } from 'next/image';
import { RootState } from '../store';
import { MessageState } from './messages-slice';
import { UserState } from './user-slice';
// Type for our state

export type ContactState = {
   contactUsers?: MessageState[];
   onlineUsers?: number[];
   currentChatUser?: UserState;
   filteredContact?: MessageState[];
};

/* Persist */

// Initial state

const initialContactState: ContactState = {
   contactUsers: [],
   onlineUsers: [],
   currentChatUser: undefined,
   filteredContact: [],
};

// Actual Slice

export const contactSlice = createSlice({
   name: 'contact',
   initialState: initialContactState,
   reducers: {
      setContactUsers: (state, action: PayloadAction<MessageState[]>) => {
         return { ...state, contactUsers: action.payload };
      },
      setOnlineUsers(state, action: PayloadAction<number[]>) {
         return {
            ...state,
            onlineUsers: action.payload,
         };
      },
      setFilteredContact(state, action: PayloadAction<string>) {
         return {
            ...state,
            filteredContact: state?.contactUsers?.filter((message) =>
               message?.receiver?.name
                  .toLowerCase()
                  .includes(action.payload.toLowerCase()),
            ),
         };
      },
      setCurrentChatUser(state, action: PayloadAction<UserState | undefined>) {
         return {
            ...state,
            currentChatUser: action.payload,
         };
      },
      setExitChat(state) {
         return { ...state, currentChatUser: undefined };
      },
   },
});

export const {
   setContactUsers,
   setCurrentChatUser,
   setExitChat,
   setFilteredContact,
   setOnlineUsers,
} = contactSlice.actions;

export default contactSlice.reducer;

export const contactSelector = (state: RootState) =>
   state.persistedReducer.contactReducer;
