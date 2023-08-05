import {
   AllContacts,
   FormatReceive,
   InitialContacts,
   MessageReceive,
   MessagesReceive,
   Token,
} from '@/type';
import {
   ADD_AUDIO_MESSAGE_ROUTE,
   ADD_IMAGE_MESSAGE_ROUTE,
   ADD_MESSAGE_ROUTE,
   GET_ALL_CONTACTS,
   GET_CALL_TOKEN,
   GET_INITIAL_CONTACTS_ROUTE,
   GET_MESSAGE_ROUTE,
} from '@/utils/ApiRoutes';
import axios from 'axios';

export const getMessages = async (id: number, currentChatUserId: number) => {
   const {
      data: { data },
   } = await axios.get<FormatReceive<MessagesReceive[]>>(
      `${GET_MESSAGE_ROUTE}/${id}/${currentChatUserId}`,
   );
   return data;
};

export const sendMessages = async (
   id: number,
   currentChatUserId: number,
   message: string,
) => {
   const {
      data: { data },
   } = await axios.post<FormatReceive<MessagesReceive>>(ADD_MESSAGE_ROUTE, {
      to: currentChatUserId,
      from: id,
      message,
   });
   return data;
};

export const getInitialContacts = async (id: number) => {
   const {
      data: { data },
   } = await axios.get<FormatReceive<InitialContacts>>(
      `${GET_INITIAL_CONTACTS_ROUTE}/${id}`,
   );
   return data;
};

export const getAllContacts = async () => {
   const {
      data: { data },
   } = await axios.get<FormatReceive<AllContacts>>(GET_ALL_CONTACTS);
   return data;
};

export const getToken = async (id: number) => {
   const {
      data: { data },
   } = await axios.get<FormatReceive<Token>>(`${GET_CALL_TOKEN}/${id}`);
   return data;
};

export const uploadVoiceMessage = async (
   id: number,
   currentChatUserId: number,
   url: string,
) => {
   const {
      data: { data },
   } = await axios.post<FormatReceive<MessagesReceive>>(
      ADD_AUDIO_MESSAGE_ROUTE,
      { url },
      {
         params: {
            from: id,
            to: currentChatUserId,
         },
      },
   );
   return data;
};

export const uploadImageMessage = async (
   id: number,
   currentChatUserId: number,
   url: string,
) => {
   const {
      data: { data },
   } = await axios.post<FormatReceive<MessagesReceive>>(
      ADD_IMAGE_MESSAGE_ROUTE,
      { url },
      {
         params: {
            from: id,
            to: currentChatUserId,
         },
      },
   );
   return data;
};
