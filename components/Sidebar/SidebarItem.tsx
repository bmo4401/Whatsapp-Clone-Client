'use client';
import { setCurrentChatUser } from '@/redux/features/contact-slice';
import { MessageState, messageSelector } from '@/redux/features/messages-slice';
import {
   UserState,
   setContact,
   userSelector,
} from '@/redux/features/user-slice';
import { calculateTime, cn } from '@/utils/utils';
import React, { useEffect } from 'react';
import { FaCamera, FaMicrophone } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import MessageStatus from '../common/MessageStatus';

interface SidebarItemProps {
   data?: UserState;
   message?: MessageState;
   isContactPage?: boolean;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
   data,
   isContactPage,
   message,
}) => {
   const { id } = useSelector(userSelector);
   const dispatch = useDispatch();
   const handleContactClick = () => {
      if (!isContactPage && message && data) {
         dispatch(
            setCurrentChatUser({
               ...data,
               id:
                  id == message.senderId
                     ? message.receiverId
                     : message.senderId,
            }),
         );
      } else {
         dispatch(setCurrentChatUser(data!));
         dispatch(setContact()); //switch
      }
   };
   return (
      <div
         onClick={handleContactClick}
         className={cn(
            'flex cursor-pointer items-center hover:bg-background-default-hover',
         )}
      >
         <div className="min-w-fit px-5 pt-3 pb-1">
            <Avatar
               type="lg"
               image={data?.profileImage!}
               setImage={() => {}}
            />
         </div>
         <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
            <div className="flex justify-between">
               <div>
                  <span className="text-white">{data?.name}</span>
               </div>
               {!isContactPage && message && (
                  <div>
                     <span
                        className={cn(
                           'text-sm',
                           message?.totalUnreadMessages! > 0
                              ? 'text-icon-green'
                              : 'text-secondary',
                        )}
                     >
                        {calculateTime(message.createdAt!)}
                     </span>
                  </div>
               )}
            </div>
            <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
               <div className="flex justify-between w-full">
                  <span className="text-secondary line-clamp-1 text-sm">
                     {!isContactPage ? (
                        <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                           {message && id === message.senderId && (
                              <MessageStatus messageStatus={message.status!} />
                           )}
                           {message?.type === 'text' && (
                              <span className="truncate">
                                 {message.message}
                              </span>
                           )}
                           {message?.type === 'audio' && (
                              <span className="flex gap-1 items-center">
                                 <FaMicrophone className="text-panel-header-icon" />
                                 Audio
                              </span>
                           )}
                           {message?.type === 'image' && (
                              <span className="flex gap-1 items-center">
                                 <FaCamera className="text-panel-header-icon" />
                                 Image
                              </span>
                           )}
                        </div>
                     ) : (
                        data?.about || '\u00A0'
                     )}
                  </span>
                  {message?.totalUnreadMessages! > 0 && (
                     <span className="bg-icon-green px-[5px] rounded-full text-sm">
                        {message?.totalUnreadMessages}
                     </span>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default SidebarItem;
