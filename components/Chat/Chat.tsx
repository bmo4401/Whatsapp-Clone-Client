import React from 'react';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import MessageBar from './MessageBar';

interface ChatProps {
   socket: any;
}
const Chat: React.FC<ChatProps> = ({ socket }) => {
   return (
      <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10">
         <ChatHeader />
         <ChatContainer />
         <MessageBar socket={socket} />
      </div>
   );
};

export default Chat;
