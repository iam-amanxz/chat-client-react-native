import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useChat} from './ChatContext';

interface MessageData {
  senderId: string;
  content: string;
  senderName: string;
}

const ChatPage = ({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const chat = useChat();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageData[]>([] as MessageData[]);
  const ws = React.useRef(new WebSocket('ws://192.168.8.196:8000')).current;

  async function fetchMessages() {
    fetch('http://192.168.8.196:9000/messages/' + chat?.room?.id)
      .then(res => res.json())
      .then(messages => {
        setMessages(prev => [...prev, ...messages]);
      })
      .catch(e => {
        console.error(e);
      });
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    ws.onopen = handleOpen;
    ws.onmessage = handleMessage;
    ws.onerror = handleError;
    ws.onclose = handleClose;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPressed,
    );

    return () => {
      // ws.close();
      backHandler.remove();
    };
  }, []);
  function handleBackPressed() {
    chat?.setRoom(undefined);
    chat?.setUser(undefined);

    setCurrentPage('auth');
    return true;
  }
  function handleMessage(e: WebSocketMessageEvent) {
    const messageData = JSON.parse(e.data) as MessageData;

    setMessages(prev => {
      return [...prev, messageData];
    });
  }
  function handleError(e: WebSocketErrorEvent) {
    console.error(e);
    setCurrentPage('auth');
  }
  function handleClose() {
    console.log('socket connection ended');

    const request = {
      action: 'LEAVE',
      message: null,
      roomId: chat?.room?.id,
      userId: chat?.user?.id,
    };

    ws.send(JSON.stringify(request));
  }
  function handleOpen() {
    console.log('socket connection opened');

    const request = {
      action: 'JOIN',
      message: null,
      roomId: chat?.room?.id,
      userId: chat?.user?.id,
      username: chat?.user?.name,
    };

    ws.send(JSON.stringify(request));
  }
  function handleSendMessage() {
    if (message.trim() === '') return;

    const request = {
      action: 'MESSAGE',
      roomId: chat?.room?.id,
      message: message,
      userId: chat?.user?.id,
      username: chat?.user?.name,
    };

    ws.send(JSON.stringify(request));

    setMessage('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{chat?.room?.name}</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Copy Link</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.chat}
        data={messages}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        renderItem={({item}) => {
          return (
            <View
              style={{
                backgroundColor:
                  item.senderId === chat?.user?.id ? '#72A6F5' : '#F2F2F2',
                maxWidth: '70%',
                minWidth: '20%',
                alignSelf:
                  item.senderId === chat?.user?.id ? 'flex-end' : 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                minHeight: 40,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 13,
                  color: item.senderId === chat?.user?.id ? 'white' : '#595959',
                  display: item.senderId === chat?.user?.id ? 'none' : 'flex',
                }}>
                {item.senderName}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: item.senderId === chat?.user?.id ? 'white' : '#595959',
                }}>
                {item.content}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.submit}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          style={styles.input}
        />
        <View style={{width: 10}} />
        <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
          <Icon name="md-send-sharp" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D7D7D7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkButton: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#72A6F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  linkText: {
    fontSize: 12,
    color: '#72A6F5',
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    color: '#404040',
    fontWeight: '700',
  },
  chat: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  submit: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 14,
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: '#72A6F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
