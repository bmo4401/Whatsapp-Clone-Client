'use client';
import { userSelector } from '@/redux/features/user-slice';
import { calculateTime } from '@/utils/utils';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';
import MessageStatus from '../common/MessageStatus';
import { contactSelector } from '@/redux/features/contact-slice';
import { MessageState } from '@/redux/features/messages-slice';

interface ImageMessageProps {
   message: MessageState;
}
const HOST = process.env.NEXT_PUBLIC_API_URL;

const ImageMessage: React.FC<ImageMessageProps> = ({ message }) => {
   const { id } = useSelector(userSelector);
   const { currentChatUser } = useSelector(contactSelector);
   return (
      <div
         className={cn(
            'p-1 rounded-lg',
            message.senderId === currentChatUser?.id
               ? 'bg-incoming-background'
               : 'bg-outgoing-background',
         )}
      >
         <div className="relative">
            <Image
               alt=""
               src={message.message}
               className="rounded-lg"
               height={300}
               width={300}
            />
            <div className="absolute bottom-1 right-1 flex items-end gap-1 ">
               <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                  {calculateTime(message.createdAt!)}
               </span>
               <span className="text-bubble-meta">
                  {message.senderId === id && (
                     <MessageStatus messageStatus={message.status!} />
                  )}
               </span>
            </div>
         </div>
      </div>
   );
};

export default ImageMessage;
