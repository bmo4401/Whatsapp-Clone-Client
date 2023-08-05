'use client';
import { userSelector } from '@/redux/features/user-slice';
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FaMicrophone } from 'react-icons/fa';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PhotoPicker from '../common/PhotoPicker';
import dynamic from 'next/dynamic';
import { SOCKET } from '@/constants/constant ';
import { contactSelector } from '@/redux/features/contact-slice';
import { setAddMessage } from '@/redux/features/messages-slice';
import {
   sendMessages,
   uploadImageMessage,
   uploadVoiceMessage,
} from '@/actions/message';
const CaptureAudio = dynamic(() => import('../common/CaptureAudio'), {
   ssr: false,
});

interface MessageBarProps {
   socket: any;
}
const uploadPreset = 'j1djdu7f';
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
const MessageBar: React.FC<MessageBarProps> = ({ socket }) => {
   /* redux */
   const { id } = useSelector(userSelector);
   const { currentChatUser } = useSelector(contactSelector);
   const dispatch = useDispatch();
   const emojiPickerRef = useRef<HTMLDivElement>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [showAudioRecorder, setShowAudioRecorder] = useState(false);
   const [message, setMessage] = useState('');
   const [grabPhoto, setGrabPhoto] = useState(false);

   useEffect(() => {
      const handleOutsideClick = (e: any) => {
         if (e.target.id !== 'emoji-open') {
            if (
               emojiPickerRef.current &&
               !emojiPickerRef.current.contains(e.target)
            ) {
               setShowEmojiPicker(false);
            }
         }
      };
      document.addEventListener('click', handleOutsideClick);
      return () => {
         document.removeEventListener('click', handleOutsideClick);
      };
   }, []);
   /* photo picker */
   useEffect(() => {
      if (grabPhoto) {
         const data = document.getElementById('photo-picker');
         data?.click();
         document.body.onfocus = (e) => {
            setTimeout(() => {
               setGrabPhoto(false);
            }, 1000);
         };
      }
   }, [grabPhoto]);
   const handleEmojiModal = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   const handleEmojiClick = (emoji: EmojiClickData) => {
      setMessage((prev) => (prev += emoji.emoji));
   };
   const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         const file = e.target.files![0];
         const formData = new FormData();
         formData.append('file', file);
         formData.append('upload_preset', uploadPreset);
         formData.append('resource_type', 'image');

         const res = await axios.post(cloudinaryUrl, formData);
         const url = res.data.secure_url;
         const data = await uploadImageMessage(+id, +currentChatUser?.id!, url);
         console.log('❄️ ~ file: MessageBar.tsx:89 ~ data:', data);
         /*    formData.append('image', file);
         const res = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
            params: {
               from: id,
               to: currentChatUser?.id,
            },
         }); */
         if (data.status) {
            socket.emit(SOCKET['SEND-MSG'], {
               to: currentChatUser?.id,
               from: id,
               message: data.data.message,
            });
            dispatch(setAddMessage(data.data));
         }
      } catch (error) {
         console.log('❄️ ~ file: MessageBar.tsx:84 ~ error:', error);
      }
   };
   const sendMessage = async () => {
      try {
         const data = await sendMessages(+id, +currentChatUser?.id!, message);

         socket.emit(SOCKET['SEND-MSG'], {
            to: currentChatUser?.id,
            from: id,
            message: data.data,
         });
         if (data.status) setMessage('');

         dispatch(setAddMessage(data.data));
      } catch (error) {
         console.log('🍀 ~ file: MessageBar.tsx:12 ~ error:', error);
      }
   };
   return (
      <div
         onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
         className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative"
      >
         {!showAudioRecorder && (
            <>
               <div className="flex gap-6">
                  <BsEmojiSmile
                     className="text-panel-header-icon cursor-pointer text-xl"
                     title="Emoji"
                     id="emoji-open"
                     onClick={handleEmojiModal}
                  />
                  {showEmojiPicker && (
                     <div
                        ref={emojiPickerRef}
                        className="absolute bottom-24 left-16 z-40"
                     >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                     </div>
                  )}
                  <ImAttachment
                     className="text-panel-header-icon cursor-pointer text-xl"
                     title="Attach File"
                     onClick={() => setGrabPhoto(true)}
                  />
               </div>
               <div className="w-full rounded-lg h-10 flex items-center">
                  <input
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     type="text"
                     placeholder="Type a message"
                     className="w-full bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4"
                  />
               </div>
               <div className="flex items-center justify-center w-10">
                  <button>
                     {message.length ? (
                        <MdSend
                           onClick={sendMessage}
                           className="text-panel-header-icon cursor-pointer text-xl"
                           title="Send Message"
                        />
                     ) : (
                        <FaMicrophone
                           className="text-panel-header-icon cursor-pointer text-xl"
                           title="Record"
                           onClick={() => setShowAudioRecorder(true)}
                        />
                     )}
                  </button>
               </div>
            </>
         )}
         {grabPhoto && <PhotoPicker onChange={(e) => photoPickerChange(e)} />}
         {showAudioRecorder && (
            <CaptureAudio
               onChange={() => setShowAudioRecorder(false)}
               socket={socket}
            />
         )}
      </div>
   );
};

export default MessageBar;
