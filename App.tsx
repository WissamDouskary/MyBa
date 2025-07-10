import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { House, Contact, Menu, Info } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import AboutScreen from './screens/About';
import SignUpPage from 'screens/sign-in';

import './global.css';

const Stack = createNativeStackNavigator();

function CustomTabBar() {
  const navigation = useNavigation();

  return (
    <View className="flex flex-row justify-between bg-blue-200 p-5">
      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => navigation.navigate('Home')}
      >
        <House size={24} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => console.log('Contact pressed')}
      >
        <Contact size={24} color="black" />
        <Text>Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => navigation.navigate('About')}
      >
        <Info size={24} color="black" />
        <Text>About</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => console.log('Menu pressed')}
      >
        <Menu size={24} color="black" />
        <Text>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Sign" component={SignUpPage} />
      </Stack.Navigator>

      <CustomTabBar />
    </NavigationContainer>
  );
}
