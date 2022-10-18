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

const WelcomePage = ({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {height} = useWindowDimensions();
  const chat = useChat();
  const [roomId, setRoomId] = useState('');

  const styleProps = {
    height,
  };

  function handleJoinRoom() {
    if (roomId.trim() === '') return;

    fetch(`http://192.168.8.196:9000/rooms/${roomId}/join/${chat?.user?.id}`)
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
    <View style={styles(styleProps).container}>
      <Text style={styles(styleProps).title}>Hello, {chat?.user?.name}</Text>

      <View style={{height: 5}} />

      <Text style={styles(styleProps).subtitle}>
        Get started by creating your own room or joining the public lobby
      </Text>

      <View style={{height: 20}} />

      <TouchableOpacity
        style={styles(styleProps).buttonBorder}
        onPress={() => {
          setCurrentPage('create-room');
        }}>
        <Text style={styles(styleProps).buttonBorderText}>Create Room</Text>
      </TouchableOpacity>

      <View style={{height: 10}} />

      <TouchableOpacity
        style={styles(styleProps).buttonBorder}
        onPress={() => {
          chat?.setRoom({
            id: 'lobby',
            name: 'Public Lobby',
          });

          setCurrentPage('chat');
        }}>
        <Text style={styles(styleProps).buttonBorderText}>Join Lobby</Text>
      </TouchableOpacity>

      <View style={{height: 25}} />

      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          color: '#404040',
        }}>
        Or Join a Room
      </Text>

      <View style={{height: 25}} />

      <TextInput
        placeholder="Room link"
        style={styles(styleProps).input}
        value={roomId}
        onChangeText={setRoomId}
      />

      <View style={{height: 10}} />

      <TouchableOpacity
        style={styles(styleProps).button}
        onPress={handleJoinRoom}>
        <Text style={styles(styleProps).buttonText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;

const styles = (styleProps?: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      justifyContent: 'center',
      height: styleProps.height,
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
    buttonBorder: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      height: 50,
      borderColor: '#72A6F5',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      height: 50,
      backgroundColor: '#72A6F5',
    },
    buttonBorderText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#72A6F5',
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
