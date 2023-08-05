'use client';
import { userSelector } from '@/redux/features/user-slice';
import { calculateTime } from '@/utils/utils';
import { cn } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageStatus from '../common/MessageStatus';
import ImageMessage from './ImageMessage';
import dynamic from 'next/dynamic';
import { contactSelector } from '@/redux/features/contact-slice';
import { messageSelector } from '@/redux/features/messages-slice';

const VoiceMessage = dynamic(() => import('./VoiceMessage'), {
   ssr: false,
});

const ChatContainer = () => {
   const { id } = useSelector(userSelector);
   const messages = useSelector(messageSelector);
   const { currentChatUser } = useSelector(contactSelector);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      if (messages) {
         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   return (
      <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
         <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed top-0 left-0 z-0" />
         <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
            <div className="flex w-full h-full">
               <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
                  {messages &&
                     messages.map((message, idx) => {
                        return (
                           <div
                              key={message.id}
                              className={cn(
                                 'flex',
                                 message.senderId === currentChatUser?.id
                                    ? 'justify-start'
                                    : 'justify-end',
                              )}
                           >
                              {message.type === 'text' && (
                                 <div
                                    className={cn(
                                       'text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ',
                                       message.senderId === currentChatUser?.id
                                          ? 'bg-incoming-background'
                                          : 'bg-outgoing-background',
                                    )}
                                 >
                                    <span className="break-words">
                                       {message.message}
                                    </span>
                                    <div className="flex gap-1 items-end">
                                       <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                                          {calculateTime(message.createdAt!)}
                                       </span>
                                       <span>
                                          {message.senderId === id && (
                                             <MessageStatus
                                                messageStatus={message.status!}
                                             />
                                          )}
                                       </span>
                                    </div>
                                 </div>
                              )}
                              {message.type === 'image' && (
                                 <ImageMessage message={message} />
                              )}
                              {message.type === 'audio' && (
                                 <VoiceMessage message={message} />
                              )}
                           </div>
                        );
                     })}
                  <div ref={messagesEndRef} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatContainer;
