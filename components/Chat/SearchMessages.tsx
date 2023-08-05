'use client';
import { contactSelector } from '@/redux/features/contact-slice';
import { MessageState, messageSelector } from '@/redux/features/messages-slice';
import { setMessageSearch } from '@/redux/features/user-slice';
import { calculateTime } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

const SearchMessages = () => {
   const messages = useSelector(messageSelector);
   const { currentChatUser } = useSelector(contactSelector);
   const dispatch = useDispatch();
   const [searchTerm, setSearchTerm] = useState('');
   const [searchedMessages, setSearchedMessages] = useState<MessageState[]>([]);
   useEffect(() => {
      if (searchTerm) {
         setSearchedMessages(
            messages.filter(
               (message) =>
                  message.type === 'text' &&
                  message.message.includes(searchTerm),
            ),
         );
      } else {
         setSearchedMessages([]);
      }
   }, [messages, searchTerm]);
   return (
      <div className="border-conversation-border border w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
         <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
            <IoClose
               onClick={() => dispatch(setMessageSearch())}
               className="cursor-pointer text-icon-lighter text-2xl"
            />
            <span>Search Messages</span>
         </div>
         <div className="overflow-auto custom-scrollbar h-full">
            <div className="flex items-center flex-col w-full">
               <div className="flex items-center gap-3 px-5 h-14 w-full">
                  <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-row">
                     <div>
                        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
                     </div>
                     <div>
                        <input
                           type="text"
                           placeholder="Search Messages"
                           className="bg-transparent text-sm focus:outline-none text-white w-full"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
               </div>
               <span className="mt-10 text-secondary">
                  {!searchTerm.length &&
                     `Search for messages with ${currentChatUser?.name}`}
               </span>
            </div>
            <div className="flex justify-start h-full flex-col">
               {searchTerm.length > 0 && !searchedMessages.length && (
                  <span className="text-secondary">No messages found</span>
               )}
               <div className="flex flex-col">
                  {searchedMessages.map((message) => (
                     <div
                        key={message.id}
                        className=" flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5"
                     >
                        <div className="text-sm text-secondary">
                           {calculateTime(message.createdAt!)}
                        </div>
                        <div className="text-icon-green">{message.message}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default SearchMessages;
