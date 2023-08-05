'use client';
import {
   contactSelector,
   setContactUsers,
   setOnlineUsers,
} from '@/redux/features/contact-slice';
import { messageSelector } from '@/redux/features/messages-slice';
import { userSelector } from '@/redux/features/user-slice';
import { GET_INITIAL_CONTACTS_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarItem from './SidebarItem';
import { getInitialContacts } from '@/actions/message';

const SidebarList = () => {
   const { id } = useSelector(userSelector);
   const { contactUsers, filteredContact } = useSelector(contactSelector);
   const messages = useSelector(messageSelector);

   const dispatch = useDispatch();
   useEffect(() => {
      if (id) {
         try {
            (async () => {
               const { data } = await getInitialContacts(+id);

               const { users: contactUsers, onlineUsers } = data;
               dispatch(setContactUsers(contactUsers));
               dispatch(setOnlineUsers(onlineUsers));
            })();
         } catch (err) {
            console.log('❄️ ~ file: List.tsx:29 ~ err:', err);
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [messages]);
   return (
      <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
         {filteredContact && filteredContact.length > 0
            ? filteredContact.map((message) => (
                 <SidebarItem
                    data={
                       id == message.senderId
                          ? message.receiver
                          : message.sender
                    }
                    message={message}
                    key={message.id}
                 />
              ))
            : contactUsers?.map((message) => (
                 <SidebarItem
                    data={
                       id == message.senderId
                          ? message.receiver
                          : message.sender
                    }
                    message={message}
                    key={message.id}
                 />
              ))}
      </div>
   );
};

export default SidebarList;
