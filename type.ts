import { io } from 'socket.io-client';
import { UserState } from './redux/features/user-slice';
import { MessageState } from './redux/features/messages-slice';
import { CallType } from './redux/features/call-slice';
export type FormatReceive<T> = {
   statusCode: number;
   message: string;
   data: {
      message: string;
      status: boolean;
      data: T;
   };
};

export type MessageReceive = {
   from?: string;
   message: MessageState;
};

export type MessagesReceive = MessageState;

export type UserReceive = { accessToken: string; user: UserState };
export type RegisterUserReceive = UserState;

export type IncomingVoiceReceive = {
   from: UserState;
   roomId: number;
   callType: CallType;
};

export type IncomingVideoReceive = IncomingVoiceReceive;

export type InitialContacts = {
   onlineUsers: number[];
   users: MessageState[];
};
export type SocketProps = ReturnType<typeof io>;

export type AllContacts = {
   [initialLetter: string]: UserState[];
};

export type Token = string;
