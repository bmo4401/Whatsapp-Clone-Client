'use client';
import { cn } from '@/utils/utils';
import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
   options: { name: string; callback: () => void }[];
   coordinates: { x: number; y: number };
   contextMenu: any;
   setContextMenu: (value: boolean) => void;
}
const ContextMenu: React.FC<ContextMenuProps> = ({
   contextMenu,
   coordinates,
   options,
   setContextMenu,
}) => {
   const contextMenuRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      const handleOutsideClick = (e: any) => {
         if (e.target.id !== 'context-opener')
            if (
               contextMenuRef.current &&
               !contextMenuRef.current.contains(e.target)
            ) {
               setContextMenu(false);
            }
      };
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
   }, []);
   const handleClick = (
      e: React.MouseEvent<HTMLLIElement, MouseEvent>,
      callback: () => void,
   ) => {
      e.stopPropagation();
      callback();
      setContextMenu(false);
   };
   return (
      <div
         ref={contextMenuRef}
         className={cn(
            'drop-shadow-xl rounded-md bg-dropdown-background fixed py-2 z-[100] shadow-xl',
         )}
         style={{ top: coordinates.y, left: coordinates.x }}
      >
         <ul>
            {options.map(({ name, callback }) => (
               <li
                  key={name}
                  onClick={(e) => handleClick(e, callback)}
                  className=" px-5 py-2 cursor-pointer hover:bg-background-default-hover"
               >
                  <span className="text-white">{name}</span>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ContextMenu;
