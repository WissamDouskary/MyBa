import React, { useContext } from "react"
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
} from "react-native"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint } from "lucide-react-native"
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios"

interface LoginScreenProps {
    navigation: any
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [rememberMe, setRememberMe] = React.useState(false)

    const { login } = useContext(AuthContext);

    // Form validation
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isFormValid = () => {
        return email.trim() !== "" && password.trim() !== "" && isValidEmail(email) && password.length >= 6
    }

    const handleLogin = async () => {
        if (!isFormValid()) {
            Alert.alert("Invalid Input", "Please enter a valid email and password (minimum 6 characters).")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post("http://192.168.0.179:8000/api/login", {
                email: email,
                password: password
            });
            const data = response.data;
            await login(data.token);
            Alert.alert("Success", "Login successful!", [{ text: "OK", onPress: () => navigation.navigate("Home") }])
        } catch (error) {
            if (error.response) {
                console.log('Validation errors:', error.response.data.message);
                Alert.alert('Validation failed', error.response.data.message);
            } else {
                console.log('Error', error.message);
                Alert.alert('Error', error.message);
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleBiometricLogin = () => {
        Alert.alert("Biometric Login", "Biometric authentication would be implemented here.")
    }

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword")
    }

    const handleSignUp = () => {
        navigation.navigate("Sign Up")
    }

    return (
        <KeyboardAvoidingView className="flex-1 bg-gray-50" behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="bg-blue-600 pt-16 pb-12 px-6 rounded-b-3xl">
                    <View className="items-center">
                        <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
                            <Text className="text-blue-600 text-2xl font-bold">B</Text>
                        </View>
                        <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
                        <Text className="text-blue-100 text-base text-center">Sign in to access your account</Text>
                    </View>
                </View>

                {/* Login Form */}
                <View className="px-6 -mt-8">
                    <View className="bg-white rounded-2xl p-6 shadow-lg">
                        {/* Email Input */}
                        <View className="mb-4">
                            <Text className="text-gray-700 text-sm font-medium mb-2">Email Address</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                                <Mail size={20} color="#6b7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 text-base"
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
                            <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                                <Lock size={20} color="#6b7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                                    {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center">
                                <View
                                    className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${rememberMe ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                        }`}
                                >
                                    {rememberMe && <Text className="text-white text-xs">✓</Text>}
                                </View>
                                <Text className="text-gray-600 text-sm">Remember me</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text className="text-blue-600 text-sm font-medium">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={!isFormValid() || isLoading}
                            className={`flex-row items-center justify-center py-4 px-6 rounded-xl mb-4 ${isFormValid() && !isLoading ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            {isLoading ? (
                                <Text className="text-white font-semibold text-base">Signing In...</Text>
                            ) : (
                                <>
                                    <Text className="text-white font-semibold text-base mr-2">Sign In</Text>
                                    <ArrowRight size={20} color="white" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Biometric Login */}
                        <TouchableOpacity
                            onPress={handleBiometricLogin}
                            className="flex-row items-center justify-center py-3 px-6 bg-gray-100 rounded-xl mb-4"
                        >
                            <Fingerprint size={20} color="#6b7280" />
                            <Text className="text-gray-700 font-medium text-base ml-2">Use Biometric Login</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text className="mx-4 text-gray-500 text-sm">or</Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        {/* Sign Up Link */}
                        <View className="flex-row items-center justify-center">
                            <Text className="text-gray-600 text-base">Dont have an account? </Text>
                            <TouchableOpacity onPress={handleSignUp}>
                                <Text className="text-blue-600 font-semibold text-base">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Security Notice */}
                <View className="px-6 mt-6 mb-8">
                    <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <Text className="text-yellow-800 text-sm text-center">
                            <Text className="font-semibold">Security Notice:</Text> Never share your login credentials. Our bank will
                            never ask for your password via email or phone.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
