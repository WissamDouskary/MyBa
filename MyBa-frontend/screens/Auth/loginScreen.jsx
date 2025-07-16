'use client';

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from 'config';
import axios from 'axios';
import { storeUserSession } from 'components/Storage/saveUserSession';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);

  // Form validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      email.trim() !== '' && password.trim() !== '' && isValidEmail(email) && password.length >= 6
    );
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid email and password (minimum 6 characters).'
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });
      const data = response.data;
      const { token, user, account } = response.data;

      await storeUserSession(token, user, account);
      login(token)
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            login(token);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      if (error.response) {
        console.log('Validation errors:', error.response.data.message);
        Alert.alert('Validation failed', error.response.data.message);
      } else {
        console.log('Error', error.message);
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    Alert.alert('Biometric Login', 'Biometric authentication would be implemented here.');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('Sign Up');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="rounded-b-3xl bg-blue-600 px-6 pb-12 pt-16">
          <View className="items-center">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
              <Text className="text-2xl font-bold text-blue-600">B</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-white">Welcome Back</Text>
            <Text className="text-center text-base text-blue-100">
              Sign in to access your account
            </Text>
          </View>
        </View>
        {/* Login Form */}
        <View className="-mt-8 px-6">
          <View className="rounded-2xl bg-white p-6 shadow-lg">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Email Address</Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Mail size={20} color="#6b7280" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            {/* Password Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Password</Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {/* Remember Me & Forgot Password */}
            <View className="mb-6 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center">
                <View
                  className={`mr-2 h-5 w-5 items-center justify-center rounded border-2 ${
                    rememberMe ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                  {rememberMe && <Text className="text-xs text-white">✓</Text>}
                </View>
                <Text className="text-sm text-gray-600">Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-sm font-medium text-blue-600">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isFormValid() || isLoading}
              className={`mb-4 flex-row items-center justify-center rounded-xl px-6 py-4 ${
                isFormValid() && !isLoading ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
              {isLoading ? (
                <Text className="text-base font-semibold text-white">Signing In...</Text>
              ) : (
                <>
                  <Text className="mr-2 text-base font-semibold text-white">Sign In</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
            {/* Biometric Login */}
            <TouchableOpacity
              onPress={handleBiometricLogin}
              className="mb-4 flex-row items-center justify-center rounded-xl bg-gray-100 px-6 py-3">
              <Fingerprint size={20} color="#6b7280" />
              <Text className="ml-2 text-base font-medium text-gray-700">Use Biometric Login</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="my-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-200" />
              <Text className="mx-4 text-sm text-gray-500">or</Text>
              <View className="h-px flex-1 bg-gray-200" />
            </View>
            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-base text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text className="text-base font-semibold text-blue-600">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Security Notice */}
        <View className="mb-8 mt-6 px-6">
          <View className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <Text className="text-center text-sm text-yellow-800">
              <Text className="font-semibold">Security Notice:</Text> Never share your login
              credentials. Our bank will never ask for your password via email or phone.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
