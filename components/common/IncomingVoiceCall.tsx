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
   setIncomingVoiceCall,
   setVoiceCall,
} from '@/redux/features/call-slice';
const IncomingVoiceCall = ({ socket }: { socket: SocketProps }) => {
   const { incomingVoiceCall } = useSelector(callSelector);

   const dispatch = useDispatch();

   const acceptedVoiceCall = () => {
      if (incomingVoiceCall)
         dispatch(
            setVoiceCall({
               ...incomingVoiceCall,
               type: 'in-coming',
            }),
         );
      dispatch(setIncomingVoiceCall(undefined));
      socket.emit(SOCKET['ACCEPT-INCOMING-CALL'], {
         id: incomingVoiceCall?.user?.id,
      });
   };
   const rejectedVoiceCall = () => {
      dispatch(setEndCall());
      socket.emit(SOCKET['REJECT-VIDEO-CALL'], {
         from: incomingVoiceCall?.user?.id,
      });
   };
   return (
      <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm gap-5 flex items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-2 py-14 border-icon-green">
         <div>
            <Image
               src={incomingVoiceCall?.user?.profileImage!}
               alt=""
               width={70}
               height={70}
               className="rounded-full"
            />
         </div>
         <div>
            <div>{incomingVoiceCall?.user?.name}</div>
            <div className="text-xs">Incoming Voice Call</div>
            <div className="flex gap-2 mt-2">
               <button
                  onClick={rejectedVoiceCall}
                  className="bg-red-500 p-1 px-3 text-sm rounded-full"
               >
                  Reject
               </button>
               <button
                  onClick={acceptedVoiceCall}
                  className="bg-green-500 p-1 px-3 text-sm rounded-full"
               >
                  Accept
               </button>
            </div>
         </div>
      </div>
   );
};

export default IncomingVoiceCall;
