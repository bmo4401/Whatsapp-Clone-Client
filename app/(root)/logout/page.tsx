'use client';
import { SOCKET } from '@/constants/constant ';
import { userSelector, setSignOut } from '@/redux/features/user-slice';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Logout = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const socketInit = io(process.env.NEXT_PUBLIC_API_URL!);
   const { id, email } = useSelector(userSelector);
   useEffect(() => {
      socketInit.emit(SOCKET['SIGN-OUT'], id);
      dispatch(setSignOut());
      signOut(firebaseAuth);
      router.push('/login');
   }, [dispatch, id, router, socketInit]);
   return <div className="bg-conversation-panel-background" />;
};

export default Logout;
