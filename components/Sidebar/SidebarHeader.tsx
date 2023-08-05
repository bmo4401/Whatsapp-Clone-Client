'use client';
import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '@/redux/features/user-slice';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import { setContact } from '@/redux/features/user-slice';
import { useRouter } from 'next/navigation';
import ContextMenu from '../common/ContextMenu';
const SidebarHeader = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const { profileImage, name } = useSelector(userSelector);

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
         name: 'Logout',
         callback: async () => {
            setIsContextMenuVisible(false);
            router.push('/logout');
         },
      },
   ];

   const handleAllContactsPage = () => {
      dispatch(setContact());
   };

   return (
      <div className="h-16 px-4 py-3 flex justify-between items-center">
         <div className="flex items-center gap-5 cursor-pointer">
            <Avatar
               type="sm"
               image={profileImage}
               setImage={() => {}}
            />
            <span className="text-white">{name}</span>
         </div>
         <div className="flex gap-6">
            <BsFillChatLeftTextFill
               className="text-panel-header-icon cursor-pointer text-xl"
               title="New Chat"
               onClick={handleAllContactsPage}
            />
            <>
               <BsThreeDotsVertical
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Menu"
                  id="context-opener"
                  onClick={(e) => showContextMenu(e)}
               />
               {isContextMenuVisible && (
                  <ContextMenu
                     options={contextMenuOptions}
                     coordinates={contextMenuCoordinates}
                     contextMenu={isContextMenuVisible}
                     setContextMenu={(e) => setIsContextMenuVisible(e)}
                  />
               )}
            </>
         </div>
      </div>
   );
};

export default SidebarHeader;
