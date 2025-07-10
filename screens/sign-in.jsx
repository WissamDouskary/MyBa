import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!');
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View className="px-6 py-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Create Your Account
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-8 leading-relaxed">
            Join thousands of users and start your journey with us today
          </Text>
        </View>

        {/* Sign Up Form */}
        <View className="px-6 pb-8">
          <View className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Name Fields */}
            <View className="flex-row w-full mb-6">
              <View className="flex-1 mr-2 w-1/2">
                <Text className="text-gray-700 font-semibold mb-2">First Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1 w-1/2">
                <Text className="text-gray-700 font-semibold mb-2">Last Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Email Address</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="text-gray-500 text-lg">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-sm mt-1">Must be at least 8 characters</Text>
            </View>

            {/* Confirm Password Field */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text className="text-gray-500 text-lg">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <View className="flex-row items-start mb-6">
              <View className="w-5 h-5 border-2 border-gray-300 rounded mr-3 mt-0.5"></View>
              <Text className="text-gray-600 text-sm leading-relaxed flex-1">
                I agree to the{' '}
                <Text className="text-blue-600 font-semibold">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-blue-600 font-semibold">Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl mb-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Link */}
        <View className="px-6 pb-8 flex">
          <Text className="text-center text-gray-600">
            <Text>Already have an account?{' '}</Text>
            <TouchableOpacity className=''>
              <Text className="text-blue-600 font-semibold mb-[-5px]">Sign In</Text>
            </TouchableOpacity>
          </Text>
        </View>

        {/* Features Preview */}
        <View className="px-6 py-8 bg-gray-50">
          <Text className="text-xl font-bold text-gray-900 text-center mb-6">
            What Youll Get
          </Text>
          
          <View className="space-y-4 flex gap-2">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full justify-center items-center mr-4">
                <Text className="text-green-600">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">Free 14-day trial with all features</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full justify-center items-center mr-4">
                <Text className="text-green-600">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">24/7 customer support</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full justify-center items-center mr-4">
                <Text className="text-green-600">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">No setup fees or hidden charges</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full justify-center items-center mr-4">
                <Text className="text-green-600">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">Cancel anytime, no questions asked</Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View className="px-6 py-6 bg-blue-50">
          <View className="flex-row items-center justify-center mb-2">
            <Text className="text-blue-600 text-lg mr-2">🔒</Text>
            <Text className="text-blue-900 font-semibold">Your data is secure</Text>
          </View>
          <Text className="text-blue-700 text-center text-sm leading-relaxed">
            We use enterprise-grade encryption to protect your personal information and never share your data with third parties.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}