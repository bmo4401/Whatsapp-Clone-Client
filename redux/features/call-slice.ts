'use client';
import { PayloadAction, combineReducers, createSlice } from '@reduxjs/toolkit';
import { StaticImageData } from 'next/image';
import { RootState } from '../store';
import { UserState } from './user-slice';
// Type for our state

export type CallState = {
   voiceCall?: Call;
   videoCall?: Call;
   incomingVoiceCall?: Call;
   incomingVideoCall?: Call;
};
export type CallType = 'audio' | 'video';

export interface Call {
   user?: UserState;
   type: 'out-going' | 'in-coming';
   callType: CallType;
   roomId: number;
}

/* Persist */

const initialCallState: CallState = {};

export const callSlice = createSlice({
   name: 'call',
   initialState: initialCallState,
   reducers: {
      setVoiceCall(state, action: PayloadAction<Call>) {
         return {
            ...state,
            voiceCall: action.payload,
         };
      },
      setVideoCall(state, action: PayloadAction<Call>) {
         return {
            ...state,
            videoCall: action.payload,
         };
      },
      setIncomingVoiceCall(state, action: PayloadAction<Call | undefined>) {
         return {
            ...state,
            incomingVoiceCall: action.payload,
         };
      },
      setIncomingVideoCall(state, action: PayloadAction<Call | undefined>) {
         return {
            ...state,
            incomingVideoCall: action.payload,
         };
      },
      setEndCall(state) {
         return {};
      },
   },
});

export const {
   setEndCall,
   setIncomingVideoCall,
   setIncomingVoiceCall,
   setVideoCall,
   setVoiceCall,
} = callSlice.actions;

export const callSelector = (state: RootState) => state.callReducer;

export default callSlice.reducer;
