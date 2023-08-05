'use client';
import { StaticImageData } from 'next/image';
import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
interface CapturePhotoProps {
   setImage: (e: string | StaticImageData) => void;
   hideCapturePhoto: () => void;
}

const CapturePhoto: React.FC<CapturePhotoProps> = ({
   setImage,
   hideCapturePhoto,
}) => {
   const videoRef = useRef<HTMLVideoElement>(null);
   const capturePhoto = () => {
      const canvas = document.createElement('canvas');
      if (videoRef.current) {
         canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 300, 150);
         setImage(canvas.toDataURL('image/jpeg'));
         hideCapturePhoto();
      }
   };
   useEffect(() => {
      let stream: MediaStream;
      const startCamera = async () => {
         stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
         });
         if (videoRef.current) videoRef.current.srcObject = stream;
      };
      startCamera();
      return () => {
         stream?.getTracks().forEach((track) => track.stop());
      };
   }, []);
   return (
      <div className="absolute h-2/3 w-1/3 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
         <div className="flex flex-col gap-4 w-full items-center justify-center">
            <div
               onClick={hideCapturePhoto}
               className="pt-2 pr-2 cursor-pointer flex items-end justify-end"
            >
               {' '}
               <IoClose className="h-10 w-10" />
            </div>
            <div className="flex justify-center">
               <video
                  key={'hello'}
                  ref={videoRef}
                  id="video"
                  width={400}
                  autoPlay
               />
            </div>
            <button
               onClick={capturePhoto}
               className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
            />
         </div>
      </div>
   );
};

export default CapturePhoto;
