import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">MyApp</Text>
          <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full" onPress={() => navigation.navigate("Sign")}>
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View className="px-6 py-12">
          <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
            Welcome to the Future
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-8 leading-relaxed">
            Experience the next generation of mobile applications with our innovative platform
          </Text>
          
          {/* Hero Image Placeholder */}
          <View className="bg-gradient-to-r from-blue-400 to-purple-500 h-48 rounded-2xl mb-8 justify-center items-center">
            <Text className="text-white text-xl font-semibold">Hero Image</Text>
          </View>

          {/* CTA Buttons */}
          <View className="flex justify-center gap-6">
            <TouchableOpacity className="bg-blue-600 py-4 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-300 py-4 rounded-full" onPress={() => navigation.navigate("About")}>
              <Text className="text-gray-700 text-center font-semibold text-lg">Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 py-8 bg-gray-50">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Us?
          </Text>
          
          <View className="space-y-6">
            {/* Feature 1 */}
            <View className="bg-white p-6 rounded-xl shadow-sm">
              <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mb-4">
                <Text className="text-blue-600 text-xl">🚀</Text>
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</Text>
              <Text className="text-gray-600 leading-relaxed">
                Lightning-fast performance with 99.9% uptime guarantee for all your needs
              </Text>
            </View>

            {/* Feature 2 */}
            <View className="bg-white p-6 rounded-xl shadow-sm">
              <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mb-4">
                <Text className="text-green-600 text-xl">🔒</Text>
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</Text>
              <Text className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security and encryption
              </Text>
            </View>

            {/* Feature 3 */}
            <View className="bg-white p-6 rounded-xl shadow-sm">
              <View className="w-12 h-12 bg-purple-100 rounded-full justify-center items-center mb-4">
                <Text className="text-purple-600 text-xl">💡</Text>
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">Smart & Intuitive</Text>
              <Text className="text-gray-600 leading-relaxed">
                AI-powered features that adapt to your workflow and preferences
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-6 py-12">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
            Trusted by Thousands
          </Text>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-600 mb-2">10K+</Text>
              <Text className="text-gray-600 text-center">Active Users</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-green-600 mb-2">99.9%</Text>
              <Text className="text-gray-600 text-center">Uptime</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-600 mb-2">24/7</Text>
              <Text className="text-gray-600 text-center">Support</Text>
            </View>
          </View>
        </View>

        {/* Testimonial Section */}
        <View className="px-6 py-8 bg-blue-50">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
            What Our Users Say
          </Text>
          
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <Text className="text-gray-600 text-lg leading-relaxed mb-4 italic">
              This app has completely transformed how I work. The interface is intuitive and the features are exactly what I needed.
            </Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-300 rounded-full mr-4"></View>
              <View>
                <Text className="font-semibold text-gray-900">Sarah Johnson</Text>
                <Text className="text-gray-600">Product Manager</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View className="px-6 py-12 bg-gray-900">
          <Text className="text-3xl font-bold text-white text-center mb-4">
            Ready to Get Started?
          </Text>
          <Text className="text-gray-300 text-center mb-8 leading-relaxed">
            Join thousands of users who are already experiencing the future
          </Text>
          
          <TouchableOpacity className="bg-blue-600 py-4 rounded-xl mb-4">
            <Text className="text-white text-center font-semibold text-lg">Start Free Trial</Text>
          </TouchableOpacity>
          
          <Text className="text-gray-400 text-center text-sm">
            No credit card required • 14-day free trial
          </Text>
        </View>

        {/* Footer */}
        <View className="px-6 py-8 bg-gray-100">
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-2">MyApp</Text>
            <Text className="text-gray-600 text-center">
              Building the future, one app at a time
            </Text>
          </View>
          
          <View className="flex-row justify-center space-x-8 mb-6">
            <TouchableOpacity>
              <Text className="text-gray-600">About</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-600">Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-600">Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-600">Contact</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 text-center text-sm">
            © 2024 MyApp. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
