'use client';
import { getMessages } from '@/actions/message';
import { checkUser, refresh } from '@/actions/user';
import Chat from '@/components/Chat/Chat';
import SidebarContent from '@/components/Sidebar/Content';
import IncomingVideoCall from '@/components/common/IncomingVideoCall';
import IncomingVoiceCall from '@/components/common/IncomingVoiceCall';
import { callSelector } from '@/redux/features/call-slice';
import { contactSelector } from '@/redux/features/contact-slice';
import { setMessages } from '@/redux/features/messages-slice';
import { setUser, userSelector } from '@/redux/features/user-slice';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import Socket from '@/utils/Socket';
import { cn } from '@/utils/utils';
import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Empty from './Empty';

const SearchMessages = dynamic(
  () => import('@/components/Chat/SearchMessages'),
  {
    ssr: false,
  },
);
const VideoCall = dynamic(() => import('@/components/Call/VideoCall'), {
  ssr: false,
});
const VoiceCall = dynamic(() => import('@/components/Call/VoiceCall'), {
  ssr: false,
});

const Main = () => {
  const { id, email, messageSearch } = useSelector(userSelector);

  const { incomingVideoCall, incomingVoiceCall, videoCall, voiceCall } =
    useSelector(callSelector);

  const { currentChatUser } = useSelector(contactSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const socket = Socket();

  /* Auth */
  useEffect(() => {
    if (!email || !id) router.push('/login');
    if (email && id)
      (async () => {
        const res = await refresh();

        if (!res?.status) {
          alert('Session expired, please log in again.');
          router.push('/logout');
        }
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, id, router]);

  useEffect(() => {
    if (!email && !id)
      onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (email) {
          const data = await checkUser(email);
          const { user } = data.data;
          if (!data.status) router.push('/login');
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              name: user.name,
              profileImage: user.profileImage,
              status: user?.about,
              isNew: false,
            }),
          );
          router.push('/');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Get Message */
  useEffect(() => {
    if (currentChatUser?.id) {
      try {
        (async () => {
          const { data } = await getMessages(+id, +currentChatUser.id);
          dispatch(setMessages(data));
        })();
      } catch (error) {
        console.log('🍀 ~ file: Main.tsx:55 ~ error:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentChatUser]);

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall socket={socket!} />}
      {incomingVoiceCall && <IncomingVoiceCall socket={socket!} />}
      {!videoCall && !voiceCall ? (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
          <SidebarContent />
          {currentChatUser ? (
            <div className={cn(messageSearch ? 'grid grid-cols-2' : '')}>
              {' '}
              <Chat socket={socket} />
              {messageSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      ) : (
        <>
          {videoCall && (
            <div className="h-screen w-screen max-h-full overflow-hidden">
              <VideoCall socket={socket!} />
            </div>
          )}
          {voiceCall && (
            <div className="h-screen w-screen max-h-full overflow-hidden">
              <VoiceCall socket={socket!} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Main;
