import React, {useState, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import AuthPage from './src/AuthPage';
import WelcomePage from './src/WelcomePage';
import CreateRoomPage from './src/CreateRoomPage';
import ChatPage from './src/ChatPage';
import {ChatContextProvider} from './src/ChatContext';

const renderPage = (
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>,
) => {
  switch (currentPage) {
    case 'auth':
      return <AuthPage setCurrentPage={setCurrentPage} />;
    case 'welcome':
      return <WelcomePage setCurrentPage={setCurrentPage} />;
    case 'create-room':
      return <CreateRoomPage setCurrentPage={setCurrentPage} />;
    case 'chat':
      return <ChatPage setCurrentPage={setCurrentPage} />;
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('auth');

  return (
    <ChatContextProvider>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        {renderPage(currentPage, setCurrentPage)}
      </SafeAreaView>
    </ChatContextProvider>
  );
};

export default App;
