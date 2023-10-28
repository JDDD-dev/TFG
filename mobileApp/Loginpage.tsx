import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Provider as PaperProvider, TextInput } from 'react-native-paper'
import * as SecureStore from 'expo-secure-store';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { BEACON_DATA, GET_PARTNER, REGISTER_TOKEN } from './Queries';
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';
const MY_USERNAME_STATE_KEY = 'MyUsernameStateKey';

export default function Loginpage({ navigation }) {

  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const [registerPushToken, { data, loading, error }] = useMutation(REGISTER_TOKEN)

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log(status);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync({ experienceId: '@jddd/healthapp' })).data;
      console.log(token);
      await registerPushToken({ variables: { registerTokenInput: {
        username: username,
        expoPushToken: token,
      } } })
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  async function login() {
    const access_token = await fetch('http://192.168.1.145:3000/auth/login', {
      method: 'POST', 
      body: JSON.stringify({username , password}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const dejson = await access_token.json()
    console.log(dejson.access_token)
    if (dejson.access_token != null){
        await SecureStore.setItemAsync(MY_SECURE_AUTH_STATE_KEY, dejson.access_token)
        await registerForPushNotificationsAsync()
        await SecureStore.setItemAsync(MY_USERNAME_STATE_KEY, username)
        console.log(await SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY))
        navigation.navigate('Home')
    }else {
        alert('Bad Credentials')
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Healthy App</Text>
        <StatusBar style="auto" />
        <TextInput
          value={username}
          onChangeText={username => setUsername(username)}
          placeholder="Username"
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={password => setPassword(password)}
          placeholder="Password"
        ></TextInput>
        <Button
          onPress={() => {
            login()
          }}
        >
          Login
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
