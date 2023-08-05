'use client';
import React, { useEffect, useState } from 'react';
import SidebarHeader from './SidebarHeader';
('./Header');
import SearchBar from './SearchBar';
import SidebarList from './SidebarList';
import { useSelector } from 'react-redux';
import { userSelector } from '@/redux/features/user-slice';
import ContactsList from './ContactsList';

type pageType = 'DEFAULT' | 'ALL-CONTACTS';

const SidebarContent = () => {
   const { contactPage } = useSelector(userSelector);
   const [pageType, setPageType] = useState<pageType>('DEFAULT');
   useEffect(() => {
      if (contactPage) {
         setPageType('ALL-CONTACTS');
      } else {
         setPageType('DEFAULT');
      }
   }, [contactPage]);
   return (
      <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
         {pageType === 'DEFAULT' ? (
            <>
               <SidebarHeader />
               <SearchBar />
               <SidebarList />
            </>
         ) : (
            <>
               <ContactsList />
            </>
         )}
      </div>
   );
};

export default SidebarContent;
