'use client';
import { userSelector } from '@/redux/features/user-slice';
import { cn, formatTime } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import Avatar from '../common/Avatar';
import { FaPlay, FaStop } from 'react-icons/fa';
import { calculateTime } from '@/utils/utils';
import MessageStatus from '../common/MessageStatus';
import { contactSelector } from '@/redux/features/contact-slice';
import { MessageState } from '@/redux/features/messages-slice';
interface MessageMessageProps {
   message: MessageState;
}
const HOST = process.env.NEXT_PUBLIC_API_URL;

const VoiceMessage: React.FC<MessageMessageProps> = ({ message }) => {
   const { id } = useSelector(userSelector);
   const { currentChatUser } = useSelector(contactSelector);

   const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | null>(
      null,
   );
   const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
   const [totalDuration, setTotalDuration] = useState(0);

   const [isPlaying, setIsPlaying] = useState(false);
   const waveformRef = useRef<HTMLDivElement>(null);
   const waveform = useRef<WaveSurfer | null>(null);

   useEffect(() => {
      if (waveform.current === null) {
         if (waveformRef.current) {
            waveform.current = WaveSurfer.create({
               container: waveformRef.current,
               waveColor: '#ccc',
               progressColor: '#4a9eff',
               cursorColor: '#7ae3c3',
               barWidth: 2,
               height: 30,
            });
            waveform.current.on('finish', () => {
               setIsPlaying(false);
            });
         }
      }
      return () => {
         waveform?.current?.destroy();
      };
   }, []);
   useEffect(() => {
      if (waveform.current) {
         const audioURL = message.message;
         const audio = new Audio(audioURL);
         setAudioMessage(audio);
         //@ts-ignore
         waveform.current.load(audioURL);
         waveform.current.on('ready', (duration) => {
            setTotalDuration(duration);
         });
      }
   }, [message.message]);
   useEffect(() => {
      if (audioMessage) {
         const updatePlaybackTime = () => {
            setCurrentPlaybackTime(audioMessage.currentTime);
         };
         audioMessage.addEventListener('timeupdate', updatePlaybackTime);
         audioMessage.addEventListener('ended', onEnded);
         return () => {
            audioMessage.removeEventListener('timeupdate', updatePlaybackTime);
         };
      }
   }, [audioMessage]);
   const handlePlayAudio = () => {
      if (audioMessage && waveform.current) {
         waveform.current.stop();
         waveform.current.play();
         audioMessage.play();
         setIsPlaying(true);
      }
   };
   const handleStopAudio = () => {
      if (waveform.current && audioMessage) {
         waveform.current.stop();
         audioMessage.pause();
         setIsPlaying(false);
      }
   };
   const onEnded = () => {
      setIsPlaying(false);
   };
   return (
      <div
         className={cn(
            'flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md',
            message.senderId === currentChatUser?.id
               ? 'bg-incoming-background'
               : 'bg-outgoing-background',
         )}
      >
         <div>
            {' '}
            <Avatar
               type="lg"
               image={currentChatUser?.profileImage!}
               setImage={() => {}}
            />
         </div>
         <div className="cursor-pointer text-xl">
            {!isPlaying ? (
               <FaPlay onClick={handlePlayAudio} />
            ) : (
               <FaStop onClick={handleStopAudio} />
            )}
         </div>
         <div className="relative">
            <div
               ref={waveformRef}
               className="w-60"
            />
            <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
               <span>
                  {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
               </span>
               <div className="flex gap-1">
                  <span>{calculateTime(message.createdAt!)}</span>
                  {message.senderId === id && (
                     <MessageStatus messageStatus={message.status!} />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default VoiceMessage;
