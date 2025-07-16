import React, { useState, useRef, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { House, Info, Menu, Contact, X, User, Settings, LogOut, Send, CreditCard, PiggyBank, Receipt } from "lucide-react-native"
import { Text, TouchableOpacity, View, Modal, SafeAreaView, StyleSheet, Dimensions, Animated, Easing, ScrollView } from "react-native"

const { width } = Dimensions.get('window')

function CustomSidebar({ isVisible, onClose, userData, accountData, onLogout }) {
  // Internal state to control Modal visibility, allowing animation to finish before unmounting
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current; // Start off-screen to the left

  const navigation = useNavigation();

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in to 0 (visible)
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8, // Slide out to off-screen left
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false); // Hide modal AFTER animation completes
      });
    }
  }, [isVisible, slideAnim]);

  const handleTabPress = (tabName, navigationTarget) => {
    setActiveTab(tabName)
    if (navigationTarget) {
      navigation.navigate(navigationTarget)
    }
    // onClose() is handled by the useEffect when isVisible becomes false
  }

  const SidebarButton = ({ icon: Icon, label, onPress, isActive, iconBgColor = "#f1f5f9", iconColor = "#64748b" }) => (
    <TouchableOpacity
      style={[
        styles.sidebarButton,
        isActive && styles.sidebarButtonActive
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.sidebarButtonIconContainer,
        isActive ? styles.sidebarButtonIconContainerActive : { backgroundColor: iconBgColor }
      ]}>
        <Icon size={20} color={isActive ? "#ffffff" : iconColor} />
      </View>
      <Text style={[
        styles.sidebarButtonLabel,
        isActive ? styles.sidebarButtonLabelActive : null
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  // Only render the Modal if modalVisible is true
  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      visible={modalVisible} // Use internal state for visibility
      transparent={true}
      animationType="fade" // Fade for the modal background
      onRequestClose={onClose} // Handles Android back button
    >
      <TouchableOpacity // This is the full-screen overlay that closes the sidebar
        style={styles.fullScreenOverlay}
        activeOpacity={1} // Ensures it's always tappable
        onPress={onClose}
      >
        <Animated.View // This is the sidebar content, animated to slide in
          style={[
            styles.sidebarAnimatedContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Prevent touches on the sidebar content from closing the modal */}
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { /* Do nothing */ }}>
            <SafeAreaView style={styles.sidebarContent}>
              {/* Header */}
              <View style={styles.sidebarHeader}>
                <View>
                  <Text style={styles.sidebarHeaderTitle}>Menu</Text>
                  <Text style={styles.sidebarHeaderSubtitle}>Navigate your app</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.sidebarCloseButton}
                >
                  <X size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* User Profile Section */}
              <View style={styles.userProfileSection}>
                <View style={styles.userProfileContent}>
                  <View style={styles.userAvatar}>
                    <User size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.userName}>
                      {userData?.first_name} {userData?.last_name}
                    </Text>
                    <Text style={styles.userEmail}>
                      {userData?.email}
                    </Text>
                  </View>
                </View>
                {/* Balance Info */}
                <View style={styles.balanceInfoCard}>
                  <Text style={styles.balanceInfoLabel}>ACCOUNT BALANCE</Text>
                  <Text style={styles.balanceInfoAmount}>
                    {accountData?.balance || '0.00'} {accountData?.currency || ''}
                  </Text>
                </View>
              </View>

              {/* Navigation Items */}
              <ScrollView style={styles.navigationItems}>
                <SidebarButton
                  icon={House}
                  label="Home"
                  onPress={() => handleTabPress("Home", "Home")}
                  isActive={activeTab === "Home"}
                />
                <SidebarButton
                  icon={Send}
                  label="Transfer Money"
                  onPress={() => handleTabPress("Transfer", "Transfert")}
                  isActive={activeTab === "Transfer"}
                  iconBgColor="#e0f2fe" // blue-100
                  iconColor="#3b82f6" // blue-500
                />
                <SidebarButton
                  icon={CreditCard}
                  label="Pay Bills"
                  onPress={() => handleTabPress("Bills", "Bills")}
                  isActive={activeTab === "Bills"}
                  iconBgColor="#dcfce7" // green-100
                  iconColor="#10b981" // green-500
                />
                <SidebarButton
                  icon={Receipt}
                  label="Transaction History"
                  onPress={() => handleTabPress("History", "History")}
                  isActive={activeTab === "History"}
                  iconBgColor="#ffedd5" // orange-100
                  iconColor="#f97316" // orange-500
                />
                <SidebarButton
                  icon={Info}
                  label="About"
                  onPress={() => handleTabPress("About", "About")}
                  isActive={activeTab === "About"}
                />
                <SidebarButton
                  icon={Contact}
                  label="Contact"
                  onPress={() => handleTabPress("Contact", "Contact")}
                  isActive={activeTab === "Contact"}
                />
                <SidebarButton
                  icon={Settings}
                  label="Settings"
                  onPress={() => handleTabPress("Settings", "Settings")}
                  isActive={activeTab === "Settings"}
                />

                {/* Divider */}
                <View style={styles.divider} />

                {/* Logout Button */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    onLogout()
                    onClose()
                  }}
                >
                  <View style={styles.logoutIconContainer}>
                    <LogOut size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.logoutButtonLabel}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Footer */}
              <View style={styles.sidebarFooter}>
                <Text style={styles.sidebarFooterText}>
                  Version 1.0.0
                </Text>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Reduced opacity for less darkness
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sidebarAnimatedContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sidebarHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sidebarHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  sidebarCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  userProfileSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  balanceInfoCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#eff6ff', // blue-50
    borderRadius: 8,
  },
  balanceInfoLabel: {
    fontSize: 12,
    color: '#3b82f6', // blue-600
    fontWeight: '500',
  },
  balanceInfoAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af', // blue-900
  },
  navigationItems: {
    flex: 1, // Allows scrolling for navigation items
    paddingTop: 20,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  sidebarButtonActive: {
    backgroundColor: '#eff6ff', // blue-50
  },
  sidebarButtonIconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  sidebarButtonIconContainerActive: {
    backgroundColor: '#3b82f6', // blue-600
  },
  sidebarButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  sidebarButtonLabelActive: {
    color: '#3b82f6', // blue-600
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb', // gray-200
    marginHorizontal: 20,
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  logoutIconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2', // red-100
    marginRight: 16,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444', // red-600
  },
  sidebarFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
  },
  sidebarFooterText: {
    fontSize: 12,
    color: '#9ca3af', // gray-400
    textAlign: 'center',
  },
});

export default CustomSidebar;