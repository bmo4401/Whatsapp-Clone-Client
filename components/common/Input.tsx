import React from 'react';

interface InputProps {
   name: string;
   value: string;
   setValue: (value: any) => void;
   label: boolean;
}

const Input: React.FC<InputProps> = ({
   label = false,
   name,
   setValue,
   value,
}) => {
   return (
      <div className="flex gap-1 flex-col">
         {label && (
            <label
               htmlFor={name}
               className="text-teal-light text-lg px-1"
            >
               {name}
            </label>
         )}
         <div>
            <input
               type="text"
               name={name}
               value={value}
               onChange={setValue}
               className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            />
         </div>
      </div>
   );
};

export default Input;
