'use client';
import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { MdCall } from 'react-icons/md';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoVideocam } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { setMessageSearch } from '@/redux/features/user-slice';
import ContextMenu from '../common/ContextMenu';
import { contactSelector, setExitChat } from '@/redux/features/contact-slice';
import { setVideoCall, setVoiceCall } from '@/redux/features/call-slice';

const ChatHeader = () => {
   const { onlineUsers, currentChatUser } = useSelector(contactSelector);
   const dispatch = useDispatch();

   const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
      x: 0,
      y: 0,
   });
   const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
   const showContextMenu = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
      setIsContextMenuVisible(true);
   };

   const contextMenuOptions = [
      {
         name: 'Exit',
         callback: async () => {
            dispatch(setExitChat());
         },
      },
   ];
   const handleVoiceCall = () => {
      dispatch(
         setVoiceCall({
            user: currentChatUser,
            type: 'out-going',
            callType: 'audio',
            roomId: Date.now(),
         }),
      );
   };
   const handleVideoCall = () => {
      dispatch(
         setVideoCall({
            user: currentChatUser,
            type: 'out-going',
            callType: 'video',
            roomId: Date.now(),
         }),
      );
   };
   return (
      <div className="h-16 px-4 py-3 justify-between items-center flex bg-panel-header-background z-50">
         <div className="flex items-center justify-center gap-6">
            <Avatar
               type="sm"
               image={currentChatUser?.profileImage || '/profile'}
               setImage={() => {}}
            />
            <div className="flex flex-col">
               <span className="text-primary-strong">
                  {currentChatUser?.name}
               </span>
               <span className="text-secondary text-sm">
                  {onlineUsers &&
                  currentChatUser?.id &&
                  onlineUsers.includes(+currentChatUser.id)
                     ? 'online'
                     : 'offline'}
               </span>
            </div>
         </div>
         <div className="flex gap-6">
            <MdCall
               onClick={handleVoiceCall}
               className="text-panel-header-icon cursor-pointer text-xl"
            />
            <IoVideocam
               onClick={handleVideoCall}
               className="text-panel-header-icon cursor-pointer text-xl"
            />
            <BiSearchAlt2
               onClick={() => dispatch(setMessageSearch())}
               className="text-panel-header-icon cursor-pointer text-xl"
            />
            <BsThreeDotsVertical
               onClick={(e) => showContextMenu(e)}
               className="text-panel-header-icon cursor-pointer text-xl"
               id="context-opener"
            />
         </div>
         {isContextMenuVisible && (
            <ContextMenu
               options={contextMenuOptions}
               coordinates={contextMenuCoordinates}
               contextMenu={isContextMenuVisible}
               setContextMenu={(e) => setIsContextMenuVisible(e)}
            />
         )}
      </div>
   );
};

export default ChatHeader;
