'use client';
import { userSelector } from '@/redux/features/user-slice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { SocketProps } from '@/type';
import { SOCKET } from '@/constants/constant ';
import {
   callSelector,
   setEndCall,
   setIncomingVideoCall,
   setVideoCall,
} from '@/redux/features/call-slice';
const IncomingVideoCall = ({ socket }: { socket: SocketProps }) => {
   const { incomingVideoCall } = useSelector(callSelector);

   const dispatch = useDispatch();
   const acceptedVideoCall = () => {
      incomingVideoCall &&
         (dispatch(
            setVideoCall({
               ...incomingVideoCall,
               type: 'in-coming',
            }),
         ),
         dispatch(setIncomingVideoCall(undefined)),
         socket.emit(SOCKET['ACCEPT-INCOMING-CALL'], {
            id: incomingVideoCall.user?.id,
         }));
   };
   const rejectedVideoCall = () => {
      incomingVideoCall &&
         (dispatch(setEndCall()),
         socket.emit(SOCKET['REJECT-VIDEO-CALL'], {
            from: incomingVideoCall.user?.id,
         }));
   };
   return (
      incomingVideoCall &&
      incomingVideoCall.user && (
         <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm gap-5 flex items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-2 py-14 border-icon-green">
            <div>
               <Image
                  src={incomingVideoCall.user.profileImage}
                  alt=""
                  width={70}
                  height={70}
                  className="rounded-full"
               />
            </div>
            <div>
               <div>{incomingVideoCall.user.name}</div>
               <div className="text-xs">Incoming Video Call</div>
               <div className="flex gap-2 mt-2">
                  <button
                     onClick={rejectedVideoCall}
                     className="bg-red-500 p-1 px-3 text-sm rounded-full"
                  >
                     Reject
                  </button>
                  <button
                     onClick={acceptedVideoCall}
                     className="bg-green-500 p-1 px-3 text-sm rounded-full"
                  >
                     Accept
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default IncomingVideoCall;
