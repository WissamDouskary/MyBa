import { View, Text, TextInput } from "react-native"
import { Mail, Phone, MapPin, Globe } from "lucide-react-native"

export default function ContactInfoStep({ data, onUpdate }) {
  return (
    <View className="space-y-6">
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Email Address *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Mail size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Enter your email"
            value={data.email}
            onChangeText={(text) => onUpdate({ email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Phone Number *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Phone size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="(555) 123-4567"
            value={data.phone}
            onChangeText={(text) => onUpdate({ phone: text })}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View>
        <Text className="text-gray-700 text-sm font-medium mb-2">Street Address *</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <MapPin size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="123 Main Street"
            value={data.address}
            onChangeText={(text) => onUpdate({ address: text })}
            autoCapitalize="words"
          />
        </View>
      </View>
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Text className="text-gray-700 text-sm font-medium mb-2">City *</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <TextInput
              className="flex-1 text-gray-900 text-base"
              placeholder="City"
              value={data.city}
              onChangeText={(text) => onUpdate({ city: text })}
              autoCapitalize="words"
            />
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 text-sm font-medium mb-2">State</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <TextInput
              className="flex-1 text-gray-900 text-base"
              placeholder="State"
              value={data.state}
              onChangeText={(text) => onUpdate({ state: text })}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Text className="text-gray-700 text-sm font-medium mb-2">Postal Code</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <TextInput
              className="flex-1 text-gray-900 text-base"
              placeholder="12345"
              value={data.postalCode}
              onChangeText={(text) => onUpdate({ postalCode: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 text-sm font-medium mb-2">Country</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <Globe size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="USA"
              value={data.country}
              onChangeText={(text) => onUpdate({ country: text })}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
