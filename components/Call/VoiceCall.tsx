'use client';
import { userSelector } from '@/redux/features/user-slice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SocketProps } from '@/type';
import Container from './Container';
import { SOCKET } from '@/constants/constant ';
import { callSelector } from '@/redux/features/call-slice';

const VoiceCall = ({ socket }: { socket: SocketProps }) => {
   const { id, profileImage, name } = useSelector(userSelector);
   const { voiceCall } = useSelector(callSelector);
   useEffect(() => {
      if (voiceCall && voiceCall.type === 'out-going') {
         socket.emit(SOCKET['OUTGOING-VOICE-CALL'], {
            to: voiceCall.user?.id,
            from: {
               id,
               profileImage,
               name,
            },
            roomId: voiceCall.roomId,
            callType: voiceCall.callType,
         });
      }
   }, [id, name, profileImage, socket, voiceCall]);
   return (
      <Container
         data={voiceCall!}
         socket={socket}
      />
   );
};

export default VoiceCall;
