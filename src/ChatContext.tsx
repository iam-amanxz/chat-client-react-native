import React, {PropsWithChildren} from 'react';

interface Room {
  id: string;
  name: string;
}
interface User {
  id: string;
  name: string;
}

interface Context {
  room?: Room;
  user?: User;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const ChatContext = React.createContext<Context | null>(null);

export const ChatContextProvider = ({children}: PropsWithChildren) => {
  const [room, setRoom] = React.useState<Room | undefined>(undefined);
  const [user, setUser] = React.useState<User | undefined>(undefined);

  const value: Context = {
    room,
    setRoom,
    user,
    setUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => React.useContext(ChatContext);
