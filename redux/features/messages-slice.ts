'use client';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserState } from './user-slice';
// Type for our state

export type MessageState = {
   id: string | number;
   message: string;
   receiverId: string;
   senderId: string;
   totalUnreadMessages?: number;
   status: 'sent' | 'delivered' | 'read' | undefined;
   type: 'image' | 'text' | 'audio' | undefined;
   receiver?: UserState;
   sender?: UserState;
   createdAt?: Date;
};

/* Persist */

// Initial state

const initialMessageState: MessageState[] = [
   {
      id: '',
      message: '',
      senderId: '',
      receiverId: '',
      status: undefined,
      type: undefined,
   },
];

export const messageSlice = createSlice({
   name: 'messages',
   initialState: initialMessageState,
   reducers: {
      setMessages(state, action: PayloadAction<MessageState[]>) {
         return action.payload;
      },

      setAddMessage(state, action: PayloadAction<MessageState>) {
         state.push(action.payload);
      },
   },
});

export const { setMessages, setAddMessage } = messageSlice.actions;

export default messageSlice.reducer;
export const messageSelector = (state: RootState) => state.messagesReducer;
