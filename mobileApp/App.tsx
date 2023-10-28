import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet} from 'react-native';
import Loginpage from './Loginpage';
import Home from './Home';
import { ApolloClient, ApolloProvider, DefaultOptions, InMemoryCache } from '@apollo/client';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const client = new ApolloClient({
  uri: 'http://192.168.1.145:3000/graphql',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
})

const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';
const MY_USERNAME_STATE_KEY = 'MyUsernameStateKey';

const Stack = createNativeStackNavigator();

export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  let firstPage = "";

  useEffect(() => {
    async function redirectAnuthenticated(){
        if (await SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY) === null){
            firstPage = "Loginpage"
        }else {
            firstPage = "Home"
        }
    }

    redirectAnuthenticated()
}, [])

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={firstPage}>
          <Stack.Screen name='Loginpage' component={Loginpage}></Stack.Screen>
          <Stack.Screen name='Home' component={Home}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
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
