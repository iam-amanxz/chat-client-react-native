import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useChat} from './ChatContext';

const CreateRoomPage = ({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {height} = useWindowDimensions();
  const [roomName, setRoomName] = useState('');
  const chat = useChat();

  const props = {
    height,
  };

  function handleCreateRoom() {
    if (roomName.trim() === '') return;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch('http://192.168.8.196:9000/rooms', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({participants: [chat?.user], name: roomName}),
    })
      .then(res => res.json())
      .then(room => {
        console.log({room});
        chat?.setRoom(room);
        setCurrentPage('chat');
      })
      .catch(e => {
        console.error(e);
      });
  }

  return (
    <View style={styles(props).container}>
      <Text style={styles(props).title}>Create a new room</Text>

      <View style={{height: 5}} />

      <Text style={styles(props).subtitle}>
        Invite your friends to your chat room by sharing the room link with
        them. You can copy the room link from the chat screen
      </Text>

      <View style={{height: 20}} />

      <TextInput
        placeholder="Room name"
        style={styles(props).input}
        value={roomName}
        onChangeText={setRoomName}
      />

      <View style={{height: 10}} />

      <TouchableOpacity style={styles(props).button} onPress={handleCreateRoom}>
        <Text style={styles(props).buttonText}>Create Room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoomPage;

const styles = (props?: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      justifyContent: 'center',
      height: props.height,
    },
    title: {
      fontSize: 20,
      color: '#404040',
      fontWeight: '700',
    },
    subtitle: {
      fontSize: 14,
      color: '#404040',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      height: 50,
      backgroundColor: '#72A6F5',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '700',
      color: 'white',
    },
    input: {
      borderWidth: 1,
      borderColor: '#D7D7D7',
      borderRadius: 5,
      paddingHorizontal: 15,
      height: 50,
      fontSize: 14,
    },
  });
