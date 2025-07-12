"use client"

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { CreditCard, PiggyBank, Wallet, DollarSign, Check } from "lucide-react-native"

const accountTypes = [
  {
    id: "checking",
    name: "Checking Account",
    description: "For everyday transactions and bill payments",
    icon: Wallet,
    minDeposit: 25,
    features: ["Debit Card", "Online Banking", "Mobile Deposits", "Bill Pay"],
  },
  {
    id: "savings",
    name: "Savings Account",
    description: "Earn interest on your deposits",
    icon: PiggyBank,
    minDeposit: 100,
    features: ["High Interest Rate", "Online Banking", "Mobile App", "No Monthly Fees"],
  },
  {
    id: "credit",
    name: "Credit Card",
    description: "Build credit with responsible spending",
    icon: CreditCard,
    minDeposit: 0,
    features: ["Rewards Program", "Fraud Protection", "Credit Building", "Mobile Payments"],
  },
]

export default function AccountSetupStep({ data, onUpdate }) {
  const selectedAccount = accountTypes.find((account) => account.id === data.accountType)

  const validateDeposit = (amount) => {
    if (!selectedAccount || selectedAccount.minDeposit === 0) return
    const numericAmount = Number.parseFloat(amount)
    if (!isNaN(numericAmount) && numericAmount < selectedAccount.minDeposit) {
      Alert.alert(
        "Minimum Deposit Required",
        `The minimum deposit for ${selectedAccount.name} is $${selectedAccount.minDeposit}. Please enter an amount of $${selectedAccount.minDeposit} or more.`,
        [{ text: "OK" }],
      )
    }
  }

  const handleDepositChange = (text) => {
    onUpdate({ initialDeposit: text })
  }

  const handleDepositBlur = () => {
    if (data.initialDeposit) {
      validateDeposit(data.initialDeposit)
    }
  }

  return (
    <View className="space-y-6">
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-4">Choose Your Account Type</Text>
        {accountTypes.map((account) => (
          <TouchableOpacity
            key={account.id}
            onPress={() => onUpdate({ accountType: account.id })}
            className={`bg-white rounded-xl p-6 mb-4 shadow-sm border-2 ${
              data.accountType === account.id ? "border-blue-500" : "border-transparent"
            }`}
          >
            <View className="flex-row items-start">
              <View
                className={`p-3 rounded-full mr-4 ${data.accountType === account.id ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <account.icon size={24} color={data.accountType === account.id ? "#3b82f6" : "#6b7280"} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-semibold text-gray-900">{account.name}</Text>
                  {data.accountType === account.id && (
                    <View className="bg-blue-500 rounded-full p-1">
                      <Check size={16} color="white" />
                    </View>
                  )}
                </View>
                <Text className="text-gray-600 text-sm mb-3">{account.description}</Text>
                <Text className="text-blue-600 font-semibold text-sm mb-3">Minimum Deposit: ${account.minDeposit}</Text>
                <View className="flex-row flex-wrap">
                  {account.features.map((feature, index) => (
                    <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                      <Text className="text-gray-700 text-xs">{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {selectedAccount && selectedAccount.minDeposit > 0 && (
        <View className="mb-2">
          <Text className="text-gray-700 text-sm font-medium my-2">
            Initial Deposit (Minimum: ${selectedAccount.minDeposit})
          </Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <DollarSign size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder={`${selectedAccount.minDeposit}.00`}
              value={data.initialDeposit}
              onChangeText={handleDepositChange}
              onBlur={handleDepositBlur}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}
      {/* Terms and Conditions */}
      <View className="bg-white rounded-xl p-6 shadow-sm">
        <TouchableOpacity
          onPress={() => onUpdate({ agreeToTerms: !data.agreeToTerms })}
          className="flex-row items-start"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              data.agreeToTerms ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
          >
            {data.agreeToTerms && <Check size={16} color="white" />}
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 text-sm leading-5">
              I agree to the <Text className="text-blue-600 font-medium">Terms of Service</Text> and{" "}
              <Text className="text-blue-600 font-medium">Privacy Policy</Text>. I understand that my account will be
              subject to verification and approval.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="bg-green-50 p-4 rounded-xl mt-2">
        <Text className="text-green-800 text-sm">
          <Text className="font-semibold">Almost Done!</Text>
          {"\n"}Your account will be created instantly and you ll receive a confirmation email. Your debit card will
          arrive within 7-10 business days.
        </Text>
      </View>
    </View>
  )
}
