'use client';
import { SOCKET } from '@/constants/constant ';
import {
  callSelector,
  setEndCall,
  setIncomingVideoCall,
  setIncomingVoiceCall,
} from '@/redux/features/call-slice';
import { setOnlineUsers } from '@/redux/features/contact-slice';
import {
  messageSelector,
  setAddMessage,
} from '@/redux/features/messages-slice';
import { userSelector } from '@/redux/features/user-slice';
import {
  IncomingVideoReceive,
  IncomingVoiceReceive,
  MessageReceive,
  SocketProps,
} from '@/type';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Socket = () => {
  const { id } = useSelector(userSelector);
  const messages = useSelector(messageSelector);

  const { videoCall, voiceCall } = useSelector(callSelector);
  const [socket, setSocket] = useState<SocketProps | null>();
  const [socketEvent, setSocketEvent] = useState(false);
  let socketInit: SocketProps;

  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketInit = io(process.env.NEXT_PUBLIC_API_URL!);
      socketInit.emit(SOCKET['ADD-USER'], id);
      setSocket(socketInit);
    }
  }, [id]);

  useEffect(() => {
    if (socket && !socketEvent) {
      socket.on(SOCKET['MSG-RECEIVE'], (data: MessageReceive) => {
        dispatch(setAddMessage({ ...data.message }));
      });
      socket.on(SOCKET['INCOMING-VOICE-CALL'], (data: IncomingVoiceReceive) => {
        const { from, roomId, callType } = data;
        dispatch(
          setIncomingVoiceCall({
            user: from,
            roomId,
            callType,
            type: 'in-coming',
          }),
        );
      });
      socket.on(SOCKET['INCOMING-VIDEO-CALL'], (data: IncomingVideoReceive) => {
        console.log('incoming');
        const { from, roomId, callType } = data;
        dispatch(
          setIncomingVideoCall({
            user: from,
            roomId,
            callType,
            type: 'in-coming',
          }),
        );
      });
      socket.on(SOCKET['VOICE-CALL-REJECTED'], () => {
        dispatch(setEndCall());
      });
      socket.on(SOCKET['VIDEO-CALL-REJECTED'], (e) => {
        console.log('❄️ ~ file: Socket.ts:83 ~ e:', e);

        dispatch(setEndCall());
      });
      socket.on(SOCKET['ONLINE-USERS'], ({ onlineUsers }) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      setSocketEvent(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  return socket;
};

export default Socket;
