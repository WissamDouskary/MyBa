"use client"

import React from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { Lock, Eye, EyeOff, Shield, ChevronDown } from "lucide-react-native"

interface SecurityStepProps {
  data: any
  onUpdate: (data: any) => void
}

const securityQuestions = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite movie?",
]

export default function SecurityStep({ data, onUpdate }: SecurityStepProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [showQuestions, setShowQuestions] = React.useState(false)

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 2) return "bg-red-500"
    if (strength < 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength < 2) return "Weak"
    if (strength < 4) return "Medium"
    return "Strong"
  }

  return (
    <View className="space-y-6">
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Password *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Lock size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Create a strong password"
            value={data.password}
            onChangeText={(text) => onUpdate({ password: text })}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
          </TouchableOpacity>
        </View>

        {data.password && (
          <View className="mt-2">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs text-gray-600">Password Strength</Text>
              <Text
                className={`text-xs font-medium ${
                  passwordStrength(data.password) < 2
                    ? "text-red-600"
                    : passwordStrength(data.password) < 4
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {getStrengthText(passwordStrength(data.password))}
              </Text>
            </View>
            <View className="flex-row space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <View
                  key={level}
                  className={`flex-1 h-1 rounded ${
                    level <= passwordStrength(data.password)
                      ? getStrengthColor(passwordStrength(data.password))
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Confirm Password *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Lock size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Confirm your password"
            value={data.confirmPassword}
            onChangeText={(text) => onUpdate({ confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
          </TouchableOpacity>
        </View>
        {data.confirmPassword && data.password !== data.confirmPassword && (
          <Text className="text-red-600 text-xs mt-1">Passwords do not match</Text>
        )}
      </View>

      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Security Question *</Text>
        <TouchableOpacity
          onPress={() => setShowQuestions(!showQuestions)}
          className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm"
        >
          <Shield size={20} color="#6b7280" />
          <Text className={`flex-1 ml-3 text-base ${data.securityQuestion ? "text-gray-900" : "text-gray-500"}`}>
            {data.securityQuestion || "Select a security question"}
          </Text>
          <ChevronDown size={20} color="#6b7280" />
        </TouchableOpacity>

        {showQuestions && (
          <View className="mt-2 bg-white rounded-xl shadow-sm overflow-hidden">
            {securityQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onUpdate({ securityQuestion: question })
                  setShowQuestions(false)
                }}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-gray-900 text-sm">{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {data.securityQuestion && (
        <View>
          <Text className="text-gray-700 text-sm font-medium mb-2">Security Answer *</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <Shield size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="Enter your answer"
              value={data.securityAnswer}
              onChangeText={(text) => onUpdate({ securityAnswer: text })}
              autoCapitalize="words"
            />
          </View>
        </View>
      )}

      <View className="bg-yellow-50 p-4 rounded-xl">
        <Text className="text-yellow-800 text-sm">
          <Text className="font-semibold">Security Tips:</Text>
          {"\n"}• Use at least 8 characters with uppercase, lowercase, numbers, and symbols
          {"\n"}• Don't use personal information in your password
          {"\n"}• Remember your security question answer - it's case sensitive
        </Text>
      </View>
    </View>
  )
}
