import { UserState, setContact } from '@/redux/features/user-slice';
import { GET_ALL_CONTACTS } from '@/utils/ApiRoutes';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import SidebarItem from './SidebarItem';
import { getAllContacts } from '@/actions/message';

interface ContactsProps {
   [initialLetter: string]: UserState[];
}

const ContactsList = () => {
   const dispatch = useDispatch();
   const [allContacts, setAllContacts] = useState<ContactsProps | undefined>(
      undefined,
   );

   const [searchTerm, setSearchTerm] = useState('');
   const [searchContacts, setSearchContacts] = useState<ContactsProps | {}>({});
   useEffect(() => {
      if (allContacts) {
         if (searchTerm) {
            let filteredData: any = {};
            Object.keys(allContacts).forEach((key) => {
               filteredData[key] = allContacts[key].filter((obj: UserState) =>
                  obj.name.toLowerCase().includes(searchTerm.toLowerCase()),
               );
            });
            setSearchContacts(filteredData);
         } else {
            setSearchContacts(allContacts);
         }
      }
   }, [searchTerm, allContacts]);
   useEffect(() => {
      try {
         (async () => {
            const data = await getAllContacts();
            if (data.status) {
               setAllContacts(data.data);
               setSearchContacts(data.data);
            }
         })();
      } catch (error) {
         console.log('🚀 ~ error:', error);
      }
   }, []);
   return (
      <div className="h-full flex flex-col">
         <div className="h-16 flex items-end px-3 py-4">
            <div className="flex items-center gap-12 text-white">
               <BiArrowBack
                  className="cursor-pointer text-xl"
                  onClick={() => dispatch(setContact())}
               />
               <span>New Chat</span>
            </div>
         </div>
         <div className="bg-search-input-container-background h-full flex flex-auto flex-col overflow-auto custom-scrollbar">
            <div className="w-full flex py-3 items-center gap-3 h-14">
               <div className="w-full bg-panel-header-background  flex items-center gap-5 px-3 py-1 rounded-lg flex-row mx-4">
                  <div>
                     <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
                  </div>
                  <div>
                     <input
                        type="text"
                        placeholder="Search Contacts"
                        className="bg-transparent text-sm focus:outline-none text-white w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
            </div>
            {Object.entries(searchContacts).map(([initialLetter, list]) => {
               return (
                  list?.length > 0 && (
                     <>
                        <div
                           key={Date.now() + initialLetter}
                           className="text-teal-light pl-10 py-5"
                        >
                           {initialLetter}
                        </div>
                        {list.map((item: UserState) => (
                           <SidebarItem
                              key={item.id}
                              data={item}
                              isContactPage={true}
                           />
                        ))}
                     </>
                  )
               );
            })}
         </div>
      </div>
   );
};

export default ContactsList;
