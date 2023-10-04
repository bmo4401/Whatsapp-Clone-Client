'use client';
import { SOCKET } from '@/constants/constant ';
import { userSelector } from '@/redux/features/user-slice';
import { GET_CALL_TOKEN } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { SocketProps } from '@/type';
import { Call, callSelector, setEndCall } from '@/redux/features/call-slice';
import { getToken } from '@/actions/message';

interface ContainerProps {
  data: Call;
  socket: SocketProps;
}
const Container: React.FC<ContainerProps> = ({ data, socket }) => {
  const { id, name } = useSelector(userSelector);
  const { videoCall, voiceCall, incomingVideoCall, incomingVoiceCall } =
    useSelector(callSelector);
  const dispatch = useDispatch();
  const { user } = data;
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [zgVar, setZgVar] = useState<any>(undefined);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined,
  );
  const [publishStream, setPublishStream] = useState<string | undefined>(
    undefined,
  );
  useEffect(() => {
    try {
      (async () => {
        const data = await getToken(+id);
        const token = data?.data;
        if (token) setToken(token);
      })();
    } catch (error) {
      console.log('❄️ ~ file: Container.tsx:33 ~ error:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAccepted]);
  useEffect(() => {
    if (data.type === 'out-going' && (incomingVideoCall || incomingVoiceCall)) {
      socket.on(SOCKET['INCOMING-CALL-ACCEPTED'], () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, incomingVideoCall, incomingVoiceCall]);

  useEffect(() => {
    if (token && !localStream) {
      try {
        const startCall = async () => {
          import('zego-express-engine-webrtc').then(
            async ({ ZegoExpressEngine }) => {
              const zg = new ZegoExpressEngine(
                parseInt(process.env.NEXT_PUBLIC_ZEGO_APPID!),
                process.env.NEXT_PUBLIC_ZEGO_SECRET!,
              );
              zg.setLogConfig({
                remoteLogLevel: 'error',
                logLevel: 'error',
              });
              setZgVar(zg);
              /* on zegocloud */
              zg.on(
                'roomStreamUpdate',
                async (roomID, updateType, streamList, extendedData) => {
                  if (updateType === 'ADD') {
                    const rmVideo = document.getElementById('remote-video');
                    const vd = document.createElement(
                      data.callType === 'video' ? 'video' : 'audio',
                    );
                    vd.id = streamList[0].streamID;
                    vd.autoplay = true;
                    //@ts-ignore
                    vd.playsInline = true;
                    vd.muted = false;
                    vd.className = 'max-w-1/2';
                    if (rmVideo) {
                      rmVideo.appendChild(vd);
                    }
                    await zg
                      .startPlayingStream(streamList[0].streamID, {
                        audio: true,
                        video: true,
                      })
                      .then((stream) => {
                        vd.srcObject = stream;
                        vd.play();
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    /*         const remoteView = zg.createRemoteStreamView(remoteStream); */
                  } else if (
                    updateType === 'DELETE' &&
                    zg &&
                    localStream &&
                    streamList[0].streamID
                  ) {
                    zg.destroyStream(localStream);
                    zg.stopPublishingStream(streamList[0].streamID);
                    zg.logoutRoom(data.roomId.toString());
                    dispatch(setEndCall());
                    setCallAccepted(false);
                  }
                },
              );

              /* login */
              zg.loginRoom(
                data.roomId.toString(),
                token,
                { userID: id?.toString()!, userName: name },
                { userUpdate: true },
              ).then(async (result) => {
                console.log(result);
                console.log(data.callType);
                const localStream = await zg.createStream({
                  camera: {
                    audio: true,
                    video: data.callType === 'video' ? true : false,
                  },
                });
                console.log(
                  '❄️ ~ file: Container.tsx:132 ~ localStream:',
                  localStream,
                );
                const localView = zg.createLocalStreamView(localStream);
                const localVideo = document.getElementById('remote-video');

                const videoElement = document.createElement(
                  data.callType === 'video' ? 'video' : 'audio',
                );

                videoElement.id = 'video-local-zego';
                videoElement.className =
                  'aspect-[1.5/1] px-2 rounded-md max-w-1/2';
                videoElement.autoplay = true;
                videoElement.muted = false;
                //@ts-ignore
                videoElement.playsInline = true;
                if (localVideo) {
                  localVideo.appendChild(videoElement);
                }
                const td = document.getElementById('video-local-zego') as
                  | HTMLVideoElement
                  | HTMLAudioElement;
                td.srcObject = localStream;
                td.play();
                localView.play('video-local-zego');
                const streamID = Date.now().toString();
                setPublishStream(streamID);
                setLocalStream(localStream);
                zg.startPublishingStream(streamID, localStream);
              });
            },
          );
        };
        if (token) startCall();
      } catch (error) {
        console.log('❄️ ~ file: Container.tsx:33 ~ error:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, localStream]);
  const handleEndCall = () => {
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    console.log(data.callType);
    if (data.callType === 'audio') {
      socket.emit(SOCKET['REJECT-VOICE-CALL'], {
        from: voiceCall?.user?.id,
      });
    } else {
      console.log('end');
      socket.emit(SOCKET['REJECT-VIDEO-CALL'], {
        from: videoCall?.user?.id,
      });
    }
    dispatch(setEndCall());
  };
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className=" flex flex-col gap-3 items-center">
        <span className="text-5xl">{user?.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== 'video'
            ? 'On going call'
            : 'Calling'}
        </span>
      </div>
      {(!callAccepted || data.callType === 'audio') && (
        <div className="my-24">
          <Image
            src={user?.profileImage!}
            alt=""
            height={300}
            width={300}
            className="rounded-full animate-pulse"
          />
        </div>
      )}
      <div
        className="w-full max-h-[500px] my-5 relative flex justify-center"
        id="remote-video"
      ></div>
      <div
        onClick={handleEndCall}
        className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full hover:opacity-80 cursor-pointer"
      >
        <MdOutlineCallEnd className="text-3xl " />
      </div>
    </div>
  );
};

export default Container;
