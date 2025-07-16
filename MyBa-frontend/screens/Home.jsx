import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Eye,
  EyeOff,
  Send,
  CreditCard,
  PiggyBank,
  Receipt,
  User,
  LogOut,
  Info,
  Smartphone,
  Car,
  Home as HomeIcon,
  TrendingUp,
  Menu,
} from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from 'config'; // Assuming 'config' is a valid import for your API_URL
import dayjs from 'dayjs';
import axios from 'axios';
import CustomSidebar from '../components/Navbar/CustomSidebar'; // Ensure this path is correct

const { width } = Dimensions.get('window');

export default function HomeScreen({ onScroll }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null); // Initialize as null
  const [accountData, setAccountData] = useState(null); // Initialize as null
  const [greetnessWord, setGreetnessWord] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]); // Ensure it's an array

  const navigation = useNavigation();

  const changeGreetness = () => {
    const now = dayjs();
    const hour = parseInt(now.format('HH'));
    if (hour >= 6 && hour < 12) {
      setGreetnessWord('Good Morning');
    } else if (hour >= 12 && hour < 18) {
      setGreetnessWord('Good Afternoon');
    } else {
      setGreetnessWord('Good Evening');
    }
  };

  const fetchUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('userData');
      const accountJson = await AsyncStorage.getItem('accountData');
      const parsedUser = userJson ? JSON.parse(userJson) : null;
      const parsedAccount = accountJson ? JSON.parse(accountJson) : null;

      setUserName(parsedUser ? `${parsedUser.first_name} ${parsedUser.last_name}` : 'Guest');
      setUserData(parsedUser);
      setAccountData(parsedAccount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTransactionData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('No user token found for transactions.');
      setRecentTransactions([]); // Ensure it's an empty array if no token
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/transaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      // Ensure response.data is an array, or default to empty array
      setRecentTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log('Error loading transactions: ' + error.message);
      setRecentTransactions([]); // Ensure it's an empty array on error
    }
  };

  useEffect(() => {
    fetchUserData();
    changeGreetness();
    fetchTransactionData();
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
    listener: (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollingDown = currentScrollY > lastScrollY.current && currentScrollY > 50;
      if (scrollingDown !== isScrollingDown) {
        setIsScrollingDown(scrollingDown);
        onScroll?.(scrollingDown);
      }
      lastScrollY.current = currentScrollY;
    },
  });

  const quickActions = [
    { icon: Send, label: 'Transfer', color: '#3b82f6', link: "Transfert" },
    { icon: CreditCard, label: 'Pay Bills', color: '#10b981', link: "Transfert" },
    { icon: PiggyBank, label: 'Save', color: '#8b5cf6', link: "Transfert" },
    { icon: Receipt, label: 'History', color: '#f97316', link: "Transfert" },
  ];

  const services = [
    { icon: Smartphone, label: 'Mobile\nRecharge', color: '#2563eb' },
    { icon: Car, label: 'Insurance\nPayment', color: '#16a34a' },
    { icon: HomeIcon, label: 'Mortgage\nPayment', color: '#7c3aed' },
    { icon: TrendingUp, label: 'Investment\nPortfolio', color: '#ea580c' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>{greetnessWord}</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
            <View style={styles.headerActions}>
              {/* Menu Button for Sidebar */}
              <TouchableOpacity 
                style={styles.headerActionButton}
                onPress={() => setSidebarVisible(true)}
              >
                <Menu size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
                <User size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton} onPress={logout}>
                <LogOut size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceCardHeader}>
              <Text style={styles.balanceCardLabel}>Total Balance</Text>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)} style={styles.eyeButton}>
                {balanceVisible ? (
                  <Eye size={18} color="#6b7280" />
                ) : (
                  <EyeOff size={18} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceCardAmount}>
              {balanceVisible ? `${accountData?.balance || '0.00'} ${accountData?.currency || ''}` : '••••••••'}
            </Text>
            <View style={styles.accountInfo}>
              <View>
                <Text style={styles.accountLabel}>Account Number</Text>
                <Text style={styles.accountNumber}>
                  {balanceVisible ? accountData?.account_number || 'N/A' : '••••••••'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickActionButton} 
                onPress={() => navigation.navigate(action.link)}
              >
                <View style={[styles.quickActionIconContainer, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="white" />
                </View>
                <Text style={styles.quickActionLabel}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* FIX: Check if recentTransactions is an array AND has length > 0 */}
          {recentTransactions && recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction, index) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index !== recentTransactions.length - 1 && styles.transactionItemBorder,
                  ]}>
                  <View
                    style={[
                      styles.transactionIconContainer,
                      { backgroundColor: transaction.type === 'received' ? '#d1fae5' : '#fee2e2' },
                    ]}>
                    <transaction.icon
                      size={20}
                      color={transaction.type === 'received' ? '#10b981' : '#ef4444'}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.title}
                    </Text>
                    <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
                    <Text style={styles.transactionTime}>{transaction.time}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'received' ? '#10b981' : '#ef4444' },
                    ]}>
                    {transaction.amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noTransactions}>
              <Info size={20} color="#6b7280" />
              <Text style={styles.noTransactionsText}>There is no transaction now!</Text>
            </View>
          )}
        </View>

        {/* Banking Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Banking Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceItem}>
                <service.icon size={32} color="#6b7280" />
                <Text style={[styles.serviceLabel, { color: service.color }]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sidebar */}
      <CustomSidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        userData={userData}
        accountData={accountData}
        onLogout={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 48, // Adjusted for StatusBar
  },
  headerContent: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Replaced space-x-4
  },
  headerActionButton: {
    borderRadius: 9999, // rounded-full
    backgroundColor: '#2563eb',
    padding: 8,
  },
  balanceCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  balanceCardHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceCardLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  eyeButton: {
    padding: 4,
  },
  balanceCardAmount: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
  },
  quickActionIconContainer: {
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickActionLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  transactionsSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  transactionsHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  noTransactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Replaced gap-1
    paddingVertical: 20,
  },
  noTransactionsText: {
    color: '#6b7280',
  },
  transactionsList: {
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionIconContainer: {
    marginRight: 16,
    borderRadius: 9999, // rounded-full
    padding: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  transactionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionTime: {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicesSection: {
    marginBottom: 32,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    width: (width - 48 - 16) / 2, // 48 for horizontal padding, 16 for gap
  },
  serviceLabel: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});