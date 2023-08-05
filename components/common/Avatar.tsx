import { cn } from '@/utils/utils';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ContextMenu from './ContextMenu';
import avatar from 'public/default_avatar.png';
import PhotoPicker from './PhotoPicker';
import PhotoLibrary from './PhotoLibrary';
import CapturePhoto from './CapturePhoto';
interface AvatarProps {
   type: 'lg' | 'sm' | 'xl';
   image: string | StaticImageData;
   setImage: (image: string | StaticImageData) => void;
}

const Avatar: React.FC<AvatarProps> = ({ image, setImage, type }) => {
   let classSize =
      (type === 'sm' && 'h-10 w-10') ||
      (type === 'lg' && 'h-14 w-14') ||
      (type === 'xl' && 'h-60 w-60 cursor-pointer');
   const [showCapturePhoto, setShowCapturePhoto] = useState(false);
   const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
   const [grabPhoto, setGrabPhoto] = useState(false);
   const [hover, setHover] = useState(false);
   const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
   const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
      x: 0,
      y: 0,
   });
   const handleShowAxis = (e: React.MouseEvent<any, MouseEvent>) => {
      e.preventDefault();
      setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
      setIsContextMenuVisible(true);
   };
   const contextMenuOptions = [
      {
         name: 'Take Photo',
         callback: () => {
            setShowCapturePhoto(true);
         },
      },
      {
         name: 'Choose From Library',
         callback: () => {
            setShowPhotoLibrary(true);
         },
      },
      {
         name: 'Upload Photo',
         callback: () => {
            setGrabPhoto(true);
         },
      },
      {
         name: 'Remove Photo',
         callback: () => {
            setImage(avatar);
         },
      },
   ];
   useEffect(() => {
      if (grabPhoto) {
         const data = document.getElementById('photo-picker');
         data?.click();
         document.body.onfocus = (e) => {
            setTimeout(() => {
               setGrabPhoto(false);
            }, 1000);
         };
      }
   }, [grabPhoto]);
   const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0] as Blob;
      const reader = new FileReader();
      const data = document.createElement('img');
      reader.onload = (e) => {
         data.src = e?.target?.result as string;
         data.setAttribute('data-src', e?.target?.result as string);
      };
      reader.readAsDataURL(file);
      setTimeout(() => setImage(data.src), 100);
   };
   return (
      <>
         <div className="flex items-center justify-center">
            {type === 'xl' ? (
               <div
                  className="relative cursor-pointer z-0"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
               >
                  <div
                     className={cn(
                        'bg-photopicker-overlay-background absolute top-0 left-0 flex items-center justify-center rounded-full flex-col text-center gap-2 z-10 aspect-square',
                        classSize,
                        hover ? 'visible' : 'hidden',
                     )}
                     onClick={(e) => handleShowAxis(e)}
                     id="context-opener"
                  >
                     <FaCamera
                        className="text-2xl"
                        id="context-opener"
                        onClick={(e) => handleShowAxis(e)}
                     />
                     <span onClick={(e) => handleShowAxis(e)}>
                        Change <br />
                        profile
                        <br /> photo
                     </span>
                  </div>
                  <div className={cn(classSize, 'aspect-square')}>
                     <Image
                        alt=""
                        src={image}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="rounded-full object-cover w-full"
                     />
                  </div>
               </div>
            ) : (
               <div className={cn('relative', classSize)}>
                  <Image
                     alt=""
                     src={image}
                     className="rounded-full object-contain"
                     fill
                  />
               </div>
            )}
         </div>
         {showCapturePhoto && (
            <CapturePhoto
               setImage={(e) => setImage(e)}
               hideCapturePhoto={() => setShowCapturePhoto(false)}
            />
         )}
         {showPhotoLibrary && (
            <PhotoLibrary
               setImage={(e) => setImage(e)}
               hidePhotoLibrary={() => setShowPhotoLibrary(false)}
            />
         )}
         {grabPhoto && <PhotoPicker onChange={(e) => photoPickerChange(e)} />}
         {isContextMenuVisible && (
            <ContextMenu
               options={contextMenuOptions}
               coordinates={contextMenuCoordinates}
               contextMenu={isContextMenuVisible}
               setContextMenu={setIsContextMenuVisible}
            />
         )}
      </>
   );
};

export default Avatar;
