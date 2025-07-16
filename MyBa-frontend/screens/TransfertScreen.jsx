import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Search,
  DollarSign,
  User,
  Banknote,
  AlertCircle,
  X,
  ArrowLeft,
  Clock,
  Shield,
  UserCheck,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function TransferScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [transferType, setTransferType] = useState('instant');
  const [currentBalance, setCurrentBalance] = useState(0.0);

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accountJson = await AsyncStorage.getItem('accountData');
        const parsedAccountData = JSON.parse(accountJson);
        setCurrentBalance(parsedAccountData.balance);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const quickAmounts = [25, 50, 100, 200, 500, 1000];
  const recentRecipients = [
    { id: 1, name: 'Sarah Johnson', lastAmount: 150, initials: 'SJ' },
    { id: 2, name: 'Mike Chen', lastAmount: 75, initials: 'MC' },
    { id: 3, name: 'Emma Wilson', lastAmount: 200, initials: 'EW' },
  ];

  const transferFees = {
    instant: { fee: 1.99, time: 'Within minutes' },
    standard: { fee: 0, time: '1-3 business days' },
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateTotal = () => {
    const transferAmount = parseFloat(amount) || 0;
    const fee = transferFees[transferType].fee;
    return transferAmount + fee;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(amount) < 1) {
      newErrors.amount = 'Minimum transfer amount is $1.00';
    } else if (calculateTotal() > currentBalance) {
      newErrors.amount = 'Insufficient balance including fees';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const searchRecipient = async () => {
    if (!accountNumber.trim()) return;
    setIsSearching(true);
    setErrors({});

    setTimeout(() => {
      const mockRecipients = {
        12345678: {
          name: 'Jane Doe',
          bank: 'Bank of America',
          accountMask: '**** 5678',
          verified: true,
          lastTransfer: '2 days ago',
        },
        87654321: {
          name: 'John Smith',
          bank: 'Chase Bank',
          accountMask: '**** 4321',
          verified: true,
          lastTransfer: '1 week ago',
        },
      };

      const found = mockRecipients[accountNumber];
      if (found) {
        setRecipient(found);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setRecipient(null);
        setErrors({ accountNumber: 'Recipient not found' });
      }
      setIsSearching(false);
    }, 1000);
  };

  const selectQuickAmount = (value) => {
    setAmount(value.toString());
    setSelectedQuickAmount(value);
    setErrors({ ...errors, amount: undefined });
  };

  const selectRecentRecipient = (recipient) => {
    setAccountNumber(`1234567${recipient.id}`);
    setAmount(recipient.lastAmount.toString());
    searchRecipient();
  };

  const handleAmountChange = (value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    const parts = cleanValue.split('.');
    if (parts[1] && parts[1].length > 2) return;

    setAmount(cleanValue);
    setSelectedQuickAmount(null);
    if (errors.amount) {
      setErrors({ ...errors, amount: undefined });
    }
  };

  const handleSendMoney = async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before proceeding');
      return;
    }

    const total = calculateTotal();
    const feeText = transferFees[transferType].fee > 0
      ? `\nFee: $${transferFees[transferType].fee.toFixed(2)}\nTotal: $${total.toFixed(2)}`
      : '';

    Alert.alert(
      'Confirm Transfer',
      `Send $${formatCurrency(amount)} to ${recipient?.name}?${feeText}\n\nDelivery: ${transferFees[transferType].time}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: processTransfer },
      ]
    );
  };

  const processTransfer = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Transfer Successful! 🎉',
        `$${formatCurrency(amount)} has been sent to ${recipient?.name}\n\nTransaction ID: TXN${Date.now()}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAccountNumber('');
              setAmount('');
              setDescription('');
              setRecipient(null);
              setSelectedQuickAmount(null);
              fadeAnim.setValue(0);
            },
          },
        ]
      );
    }, 2000);
  };

  const clearRecipient = () => {
    setRecipient(null);
    setAccountNumber('');
    fadeAnim.setValue(0);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Clock size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        {/* Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${formatCurrency(currentBalance)}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Recent Recipients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recipients</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recipientsList}>
              {recentRecipients.map((contact, index) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.recipientItem, index < recentRecipients.length - 1 && { marginRight: 16 }]}
                  onPress={() => selectRecentRecipient(contact)}>
                  <View style={styles.recipientAvatar}>
                    <Text style={styles.recipientInitials}>{contact.initials}</Text>
                  </View>
                  <Text style={styles.recipientName}>{contact.name.split(' ')[0]}</Text>
                  <Text style={styles.recipientAmount}>${contact.lastAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recipient Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <View style={[styles.inputWrapper, errors.accountNumber && styles.inputError]}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter recipient's account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                maxLength={16}
                onSubmitEditing={searchRecipient}
              />
              <TouchableOpacity
                style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                onPress={searchRecipient}
                disabled={isSearching}>
                <Search size={20} color={isSearching ? '#9ca3af' : '#3b82f6'} />
              </TouchableOpacity>
            </View>
            {errors.accountNumber && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#ef4444" />
                <Text style={styles.errorText}>{errors.accountNumber}</Text>
              </View>
            )}
          </View>

          {/* Found Recipient */}
          {recipient && (
            <Animated.View style={[styles.recipientCard, { opacity: fadeAnim }]}>
              <View style={styles.recipientCardContent}>
                <View style={styles.recipientCardAvatar}>
                  <UserCheck size={24} color="white" />
                </View>
                <View style={styles.recipientCardInfo}>
                  <View style={styles.recipientCardHeader}>
                    <Text style={styles.recipientCardName}>{recipient.name}</Text>
                    {recipient.verified && <Shield size={16} color="#10b981" />}
                  </View>
                  <Text style={styles.recipientCardBank}>{recipient.bank} - {recipient.accountMask}</Text>
                  <Text style={styles.recipientCardLastTransfer}>Last transfer: {recipient.lastTransfer}</Text>
                </View>
                <TouchableOpacity onPress={clearRecipient} style={styles.clearButton}>
                  <X size={20} color="#10b981" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount to Send</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={[styles.amountInputWrapper, errors.amount && styles.inputError]}>
              <DollarSign size={28} color="#6b7280" />
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                onFocus={() => setIsAmountFocused(true)}
                onBlur={() => setIsAmountFocused(false)}
              />
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyText}>USD</Text>
              </View>
            </View>
            {errors.amount && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#ef4444" />
                <Text style={styles.errorText}>{errors.amount}</Text>
              </View>
            )}
          </View>

          {/* Quick Amount Buttons */}
          <Text style={styles.quickSelectLabel}>Quick Select</Text>
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  { width: (width - 72) / 3 },
                  selectedQuickAmount === quickAmount && styles.quickAmountSelected
                ]}
                onPress={() => selectQuickAmount(quickAmount)}>
                <Text style={[
                  styles.quickAmountText,
                  selectedQuickAmount === quickAmount && styles.quickAmountTextSelected
                ]}>
                  ${quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transfer Speed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer Speed</Text>
          {Object.entries(transferFees).map(([type, details]) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.transferOption,
                transferType === type && styles.transferOptionSelected
              ]}
              onPress={() => setTransferType(type)}>
              <View style={styles.transferOptionContent}>
                <View style={[styles.radioButton, transferType === type && styles.radioButtonSelected]}>
                  {transferType === type && <View style={styles.radioButtonInner} />}
                </View>
                <View style={styles.transferOptionInfo}>
                  <Text style={[
                    styles.transferOptionTitle,
                    transferType === type && styles.transferOptionTitleSelected
                  ]}>
                    {type === 'instant' ? 'Instant Transfer' : 'Standard Transfer'}
                  </Text>
                  <Text style={styles.transferOptionTime}>{details.time}</Text>
                </View>
              </View>
              <Text style={[
                styles.transferOptionFee,
                transferType === type && styles.transferOptionFeeSelected
              ]}>
                {details.fee > 0 ? `$${details.fee.toFixed(2)}` : 'Free'}
              </Text>
            </TouchableOpacity>
          ))}

          {amount && (
            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Transfer Amount</Text>
                <Text style={styles.totalValue}>${formatCurrency(amount)}</Text>
              </View>
              {transferFees[transferType].fee > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Fee</Text>
                  <Text style={styles.totalValue}>${transferFees[transferType].fee.toFixed(2)}</Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text style={styles.totalLabelFinal}>Total</Text>
                <Text style={styles.totalValueFinal}>${formatCurrency(calculateTotal())}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add a note for the recipient..."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Action Button */}
      {!isAmountFocused && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
            onPress={handleSendMoney}
            disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.actionButtonText}>Processing...</Text>
            ) : (
              <View style={styles.actionButtonContent}>
                <Banknote size={24} color="white" />
                <Text style={styles.actionButtonText}>
                  Send ${amount ? formatCurrency(amount) : '0.00'}
                </Text>
                {transferFees[transferType].fee > 0 && (
                  <Text style={styles.actionButtonFee}>
                    (+${transferFees[transferType].fee.toFixed(2)} fee)
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.securityInfo}>
            <Shield size={16} color="#10b981" />
            <Text style={styles.securityText}>Protected by 256-bit encryption</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  balanceCard: {
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#bfdbfe',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  recipientsList: {
    flexDirection: 'row',
  },
  recipientItem: {
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recipientInitials: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  recipientAmount: {
    fontSize: 12,
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#e5e7eb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  searchButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  searchButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 4,
  },
  recipientCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 16,
  },
  recipientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recipientCardInfo: {
    flex: 1,
  },
  recipientCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginRight: 8,
  },
  recipientCardBank: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 2,
  },
  recipientCardLastTransfer: {
    fontSize: 12,
    color: '#047857',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#bbf7d0',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: '#e5e7eb',
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  currencyBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  quickSelectLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  quickAmountSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  quickAmountText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1e40af',
  },
  quickAmountTextSelected: {
    color: 'white',
  },
  transferOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  transferOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  transferOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderColor: '#d1d5db',
  },
  radioButtonSelected: {
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  transferOptionInfo: {
    flex: 1,
  },
  transferOptionTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  transferOptionTitleSelected: {
    color: '#1e40af',
  },
  transferOptionTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  transferOptionFee: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  transferOptionFeeSelected: {
    color: '#1e40af',
  },
  totalCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  totalLabelFinal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValueFinal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  descriptionInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  actionButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 8,
  },
  actionButtonFee: {
    color: '#bfdbfe',
    fontSize: 14,
    marginLeft: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
};