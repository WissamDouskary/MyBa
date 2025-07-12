import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/Home';
import AboutScreen from './screens/About';
import SignUpPage from './screens/Auth/registerScreen';
import LoginScreen from './screens/Auth/loginScreen';
import CustomTabBar from 'components/Navbar/CustomTabBar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './global.css';

const Stack = createNativeStackNavigator();

function AppStack() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={userToken ? 'Home' : 'Log In'}
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      {userToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name='Log In' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Sign Up' component={SignUpPage} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        setToken(storedToken);
      } catch (error) {
        console.error('Error getting token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <View className="flex-1">
          <AppStack />
          {token ? (<CustomTabBar />) : ("")}
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
}
