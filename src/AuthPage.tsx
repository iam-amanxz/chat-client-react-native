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

const AuthPage = ({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {height} = useWindowDimensions();
  const chat = useChat();
  const [username, setUsername] = useState('');

  const props = {
    height,
  };

  async function handleAuth() {
    if (username.trim() === '') return;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch('http://192.168.8.196:9000/users', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({username}),
    })
      .then(res => res.json())
      .then(user => {
        console.log({user});
        chat?.setUser({
          name: user.username,
          id: user.id,
        });
        setCurrentPage('welcome');
      })
      .catch(e => {
        console.error(e);
      });
  }

  return (
    <View style={styles(props).container}>
      <Text style={styles(props).title}>Enter your username</Text>

      <View style={{height: 20}} />

      <TextInput
        placeholder="Username"
        style={styles(props).input}
        value={username}
        onChangeText={setUsername}
      />

      <View style={{height: 10}} />

      {/* <TextInput placeholder="Password" style={styles(props).input} /> */}

      {/* <View style={{height: 10}} /> */}

      <TouchableOpacity style={styles(props).button} onPress={handleAuth}>
        <Text style={styles(props).buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthPage;

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
    input: {
      borderWidth: 1,
      borderColor: '#D7D7D7',
      borderRadius: 5,
      paddingHorizontal: 15,
      height: 50,
      fontSize: 14,
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
  });
