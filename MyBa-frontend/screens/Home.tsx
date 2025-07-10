import React from "react"
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated } from "react-native"
import {
  Eye,
  EyeOff,
  Send,
  CreditCard,
  PiggyBank,
  Receipt,
  Bell,
  User,
  LogOut,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Car,
  Home as HomeIcon,
  TrendingUp,
} from "lucide-react-native"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ onScroll }: { onScroll?: (isScrollingDown: boolean) => void }) {
  const [balanceVisible, setBalanceVisible] = React.useState(true)
  const [userName] = React.useState("John Doe")

  const { logout } = useContext(AuthContext);
  
  // Add these new state variables and refs
  const scrollY = React.useRef(new Animated.Value(0)).current
  const lastScrollY = React.useRef(0)
  const [isScrollingDown, setIsScrollingDown] = React.useState(false)

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
    listener: (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y
      const scrollingDown = currentScrollY > lastScrollY.current && currentScrollY > 50

      if (scrollingDown !== isScrollingDown) {
        setIsScrollingDown(scrollingDown)
        onScroll?.(scrollingDown)
      }

      lastScrollY.current = currentScrollY
    },
  })

  const quickActions = [
    { icon: Send, label: "Transfer", color: "bg-blue-500" },
    { icon: CreditCard, label: "Pay Bills", color: "bg-green-500" },
    { icon: PiggyBank, label: "Save", color: "bg-purple-500" },
    { icon: Receipt, label: "History", color: "bg-orange-500" },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "received",
      title: "Salary Deposit",
      subtitle: "Monthly Salary",
      amount: "+$3,500.00",
      time: "2 hours ago",
      icon: ArrowDownLeft,
    },
    {
      id: 2,
      type: "sent",
      title: "Grocery Store",
      subtitle: "Food & Beverages",
      amount: "-$127.50",
      time: "1 day ago",
      icon: ArrowUpRight,
    },
    {
      id: 3,
      type: "sent",
      title: "Electric Bill",
      subtitle: "Utilities",
      amount: "-$89.20",
      time: "2 days ago",
      icon: ArrowUpRight,
    },
  ]

  const services = [
    { icon: Smartphone, label: "Mobile\nRecharge", color: "text-blue-600" },
    { icon: Car, label: "Insurance\nPayment", color: "text-green-600" },
    { icon: HomeIcon, label: "Mortgage\nPayment", color: "text-purple-600" },
    { icon: TrendingUp, label: "Investment\nPortfolio", color: "text-orange-600" },
  ]

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />

      <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
        {/* Header Section */}
        <View className="bg-blue-600 pt-12 pb-8 px-6 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-blue-100 text-sm">Good Morning</Text>
              <Text className="text-white text-xl font-bold">{userName}</Text>
            </View>
            <View className="flex-row space-x-4 gap-4">
              <TouchableOpacity className="p-2 bg-blue-500 rounded-full">
                <User size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-blue-500 rounded-full" onPress={logout}>
                <LogOut size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 text-sm">Total Balance</Text>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)} className="p-1">
                {balanceVisible ? <Eye size={18} color="#6b7280" /> : <EyeOff size={18} color="#6b7280" />}
              </TouchableOpacity>
            </View>
            <Text className="text-gray-900 text-3xl font-bold mb-4">{balanceVisible ? "$12,847.50" : "••••••••"}</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-500 text-xs">Available</Text>
                <Text className="text-gray-900 text-lg font-semibold">
                  {balanceVisible ? "$11,200.00" : "••••••••"}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Savings</Text>
                <Text className="text-green-600 text-lg font-semibold">
                  {balanceVisible ? "$1,647.50" : "••••••••"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} className="items-center flex-1 mx-1">
                <View className={`${action.color} p-4 rounded-2xl mb-2 shadow-sm`}>
                  <action.icon size={24} color="white" />
                </View>
                <Text className="text-gray-700 text-xs font-medium text-center">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-bold">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm">
            {recentTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                className={`flex-row items-center p-4 ${
                  index !== recentTransactions.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View
                  className={`p-3 rounded-full mr-4 ${transaction.type === "received" ? "bg-green-100" : "bg-red-100"}`}
                >
                  <transaction.icon size={20} color={transaction.type === "received" ? "#10b981" : "#ef4444"} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">{transaction.title}</Text>
                  <Text className="text-gray-500 text-sm">{transaction.subtitle}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{transaction.time}</Text>
                </View>
                <Text
                  className={`font-bold text-base ${
                    transaction.type === "received" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Banking Services */}
        <View className="px-6 mt-8 mb-8">
          <Text className="text-gray-900 text-lg font-bold mb-4">Banking Services</Text>
          <View className="flex-row flex-wrap justify-between">
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm mb-4 items-center"
                style={{ width: "48%" }}
              >
                <service.icon size={32} color="#6b7280" />
                <Text className={`${service.color} text-sm font-medium mt-3 text-center`}>{service.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promotional Banner */}
        <View className="px-6 mb-8">
          <TouchableOpacity className="bg-purple-500 rounded-2xl p-6 shadow-lg">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-2">Get Your Credit Card</Text>
                <Text className="text-purple-100 text-sm mb-3">
                  Apply now and get instant approval with exclusive benefits
                </Text>
                <View className="bg-white rounded-full px-4 py-2 self-start">
                  <Text className="text-purple-600 font-semibold text-sm">Apply Now</Text>
                </View>
              </View>
              <View className="ml-4">
                <CreditCard size={48} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
