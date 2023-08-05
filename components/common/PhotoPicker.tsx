import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import {} from 'react-dom/client';
interface PhotoPickerProps {
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({ onChange }) => {
   const container = document.getElementById('photo-picker-element');
   const component = (
      <input
         type="file"
         hidden
         id="photo-picker"
         onChange={(e) => onChange(e)}
      />
   );
   return createPortal(component, container!);
};

export default PhotoPicker;
