import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './screens/Home';
import AboutScreen from './screens/About';
import SignUpPage from './screens/Auth/registerScreen';
import LoginScreen from './screens/Auth/loginScreen';
import CustomTabBar from 'components/Navbar/CustomSidebar';
import TransferScreen from 'screens/TransfertScreen';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './global.css';

const Stack = createNativeStackNavigator();

function AppStack() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1f2937" />
      </View>
    );
  }

  return (
    <Stack.Navigator
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
          <Stack.Screen name="Transfert" component={TransferScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Log In" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Sign Up" component={SignUpPage} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <View className="flex-1">
          <AppStack />
          <AuthContext.Consumer>
            {({ userToken }) => userToken ? <CustomTabBar /> : null}
          </AuthContext.Consumer>
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
}
