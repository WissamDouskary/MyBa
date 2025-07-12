"use client"

import React from "react"
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Calendar, User } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

export default function PersonalInfoStep({ data, onUpdate }) {
  const navigation = useNavigation()
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(data.dateOfBirth ? new Date(data.dateOfBirth) : new Date())

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }
    if (date) {
      setSelectedDate(date)
      const formattedDate = date.toISOString().split("T")[0]
      onUpdate({ dateOfBirth: formattedDate })
    }
  }

  const showDatePickerModal = () => {
    setShowDatePicker(true)
  }

  const handleSignInPress = () => {
    navigation.navigate("Log In")
  }

  return (
    <View className="space-y-6">
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">First Name *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <User size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Enter your first name"
            value={data.firstName}
            onChangeText={(text) => onUpdate({ firstName: text })}
            autoCapitalize="words"
          />
        </View>
      </View>
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Last Name *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <User size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Enter your last name"
            value={data.lastName}
            onChangeText={(text) => onUpdate({ lastName: text })}
            autoCapitalize="words"
          />
        </View>
      </View>
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Date of Birth *</Text>
        <TouchableOpacity
          onPress={showDatePickerModal}
          className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm"
        >
          <Calendar size={20} color="#6b7280" />
          <Text className={`flex-1 ml-3 text-base ${data.dateOfBirth ? "text-gray-900" : "text-gray-500"}`}>
            {data.dateOfBirth ? formatDate(selectedDate) : "Select your date of birth"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
        {Platform.OS === "ios" && showDatePicker && (
          <View className="flex-row justify-end mt-2 space-x-2">
            <TouchableOpacity onPress={() => setShowDatePicker(false)} className="px-4 py-2 bg-gray-200 rounded-lg">
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(false)} className="px-4 py-2 bg-blue-600 rounded-lg">
              <Text className="text-white font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View className="bg-blue-50 p-4 rounded-xl mt-6">
        <Text className="text-blue-800 text-sm">
          <Text className="font-semibold">Note:</Text> You must be 18 years or older to open a bank account. Your
          information is encrypted and secure.
        </Text>
      </View>
      <View className="flex flex-row mt-3 ml-3">
        <Text>Or you Already have an Account? </Text>
        <TouchableOpacity onPress={handleSignInPress}>
          <Text className="text-blue-600 underline font-bold"> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
