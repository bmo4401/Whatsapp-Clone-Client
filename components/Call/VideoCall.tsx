'use client';
import { userSelector } from '@/redux/features/user-slice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Container from './Container';
import { SocketProps } from '@/type';
import { SOCKET } from '@/constants/constant ';
import { callSelector } from '@/redux/features/call-slice';

const VideoCall = ({ socket }: { socket: SocketProps }) => {
   const { id, profileImage, name } = useSelector(userSelector);
   const { videoCall } = useSelector(callSelector);

   useEffect(() => {
      if (videoCall && videoCall.type === 'out-going') {
         socket.emit(SOCKET['OUTGOING-VIDEO-CALL'], {
            to: videoCall.user?.id,
            from: {
               id,
               profileImage,
               name,
            },
            roomId: videoCall.roomId,
            callType: videoCall.callType,
         });
      }
   }, [id, name, profileImage, socket, videoCall]);
   return (
      <Container
         data={videoCall!}
         socket={socket}
      />
   );
};

export default VideoCall;
