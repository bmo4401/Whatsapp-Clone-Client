'use client';
import { uploadVoiceMessage } from '@/actions/message';
import { contactSelector } from '@/redux/features/contact-slice';
import { setAddMessage } from '@/redux/features/messages-slice';
import { userSelector } from '@/redux/features/user-slice';
import { cn, formatTime } from '@/utils/utils';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
   FaMicrophone,
   FaPauseCircle,
   FaPlay,
   FaStop,
   FaTrash,
} from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
interface CaptureAudioProps {
   onChange: () => void;
   socket: any;
}
const uploadPreset = 'j1djdu7f';
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
const CaptureAudio: React.FC<CaptureAudioProps> = ({ onChange, socket }) => {
   const { id } = useSelector(userSelector);
   const { currentChatUser } = useSelector(contactSelector);

   const dispatch = useDispatch();
   const [isRecording, setIsRecording] = useState(false);

   const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(
      null,
   );

   const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
   const [recordingDuration, setRecordingDuration] = useState(0);
   const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);

   const [totalDuration, setTotalDuration] = useState(0);

   const [isPlaying, setIsPlaying] = useState(false);

   const [renderAudio, setRenderAudio] = useState<File | null>(null);

   const audioRef = useRef<HTMLAudioElement>(null);
   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
   const waveformRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRecording) {
         interval = setInterval(() => {
            setRecordingDuration((prev) => {
               setTotalDuration(prev + 1);
               return prev + 1;
            });
         }, 1000);
      }
      return () => {
         clearInterval(interval);
      };
   }, [isRecording]);

   useEffect(() => {
      const wavesurfer = WaveSurfer.create({
         container: waveformRef.current!,
         waveColor: '#ccc',
         progressColor: '#7ae3c3',
         barWidth: 2,
         height: 30,
      });
      setWaveform(wavesurfer);
      wavesurfer.on('finish', () => {
         setIsPlaying(false);
      });
      return () => {
         wavesurfer.destroy();
      };
   }, []);
   useEffect(() => {
      if (waveform) handleStartRecording();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [waveform]);
   useEffect(() => {
      if (recordedAudio) {
         const updatePlaybackTime = () => {
            setCurrentPlaybackTime(recordedAudio.currentTime);
         };
         recordedAudio.addEventListener('timeupdate', updatePlaybackTime);
         return () => {
            recordedAudio.removeEventListener('timeupdate', updatePlaybackTime);
         };
      }
   }, [recordedAudio]);

   const handleStartRecording = () => {
      setIsRecording(true);
      setRecordedAudio(null);
      setRecordingDuration(0);
      setCurrentPlaybackTime(0);
      setTotalDuration(0);

      navigator.mediaDevices
         .getUserMedia({ audio: true })
         .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            audioRef.current!.srcObject = stream;

            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
               const blob = new Blob(chunks, {
                  type: 'audio/ogg; codecs=opus',
               });
               const audioURL = URL.createObjectURL(blob);
               const audio = new Audio(audioURL);
               setRecordedAudio(audio);
               waveform?.load(audioURL);
            };
            mediaRecorder.start();
         })
         .catch((error) => {
            console.log('❄️ ~ file: CaptureAudio.tsx:76 ~ error:', error);
         });
   };
   const handleStopRecording = () => {
      if (mediaRecorderRef.current && isRecording && waveform) {
         mediaRecorderRef.current.stop();
         setIsRecording(false);
         waveform.stop();
         const audioChunks: BlobPart[] = [];
         mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
            audioChunks.push(event.data);
         });
         mediaRecorderRef.current.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioFile = new File([audioBlob], 'recording.mp3');
            setRenderAudio(audioFile);
         });
      }
   };

   const handlePlayRecording = () => {
      if (recordedAudio && waveform) {
         waveform.stop();
         waveform.play();
         recordedAudio.play();
         setIsPlaying(true);
      }
   };
   const handlePauseRecording = () => {
      if (waveform && recordedAudio) {
         waveform.stop();
         recordedAudio.pause();
         setIsPlaying(false);
      }
   };

   const handleSendRecording = async () => {
      try {
         const formData = new FormData();
         formData.append('file', renderAudio as Blob);
         formData.append('upload_preset', uploadPreset);
         formData.append('resource_type', 'audio');

         const res = await axios.post(cloudinaryUrl, formData);
         const url = res.data.secure_url;

         /*        const res = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
            params: {
               from: id,
               to: currentChatUser?.id,
            },
         });  */
         const data = await uploadVoiceMessage(+id, +currentChatUser?.id!, url);
         if (data.status) {
            socket.emit('send-msg', {
               to: currentChatUser?.id,
               from: id,
               message: data.data,
            });
            onChange();
            dispatch(setAddMessage(data.data));
         }
      } catch (error) {
         console.log('❄️ ~ file: MessageBar.tsx:84 ~ error:', error);
      }
   };

   return (
      <div className="flex text-2xl w-full justify-end items-center">
         <div className="pt-1">
            <FaTrash
               className="text-panel-header-icon"
               onClick={onChange}
            />
         </div>
         <div className="mx-4 py-2 px-4 text-white gap-3 flex items-center justify-center bg-search-input-container-background rounded-full drop-shadow-lg">
            {isRecording ? (
               <div className="text-red-500 animate-pulse w-60 text-center">
                  Recording <span>{recordingDuration}s</span>
               </div>
            ) : (
               <div>
                  {recordedAudio && (
                     <>
                        {!isPlaying ? (
                           <FaPlay onClick={handlePlayRecording} />
                        ) : (
                           <FaStop onClick={handlePauseRecording} />
                        )}
                     </>
                  )}
               </div>
            )}
            <div
               ref={waveformRef}
               className="w-60"
               hidden={isRecording}
            />
            {recordedAudio &&
               (isPlaying ? (
                  <span>{formatTime(currentPlaybackTime)}</span>
               ) : (
                  <span>{formatTime(totalDuration)}</span>
               ))}
            <audio
               ref={audioRef}
               hidden
            />
         </div>

         <div className="mr-4">
            {!isRecording ? (
               <FaMicrophone
                  onClick={handleStartRecording}
                  className="text-red-500"
               />
            ) : (
               <FaPauseCircle
                  onClick={handleStopRecording}
                  className="text-red-500"
               />
            )}
         </div>
         <div>
            <MdSend
               className={cn(
                  'text-panel-header-icon cursor-pointer mr-4',
                  isRecording && 'hidden',
               )}
               title="Send"
               onClick={handleSendRecording}
            />
         </div>
      </div>
   );
};

export default CaptureAudio;
