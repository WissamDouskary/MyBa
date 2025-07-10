import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { House, Info, Menu, Contact } from 'lucide-react-native';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function CustomTabBar() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = React.useState('Home');

  const handleTabPress = (tabName: string, navigationTarget?: string) => {
    setActiveTab(tabName);
    if (navigationTarget) {
      navigation.navigate(navigationTarget);
    }
  };

  const TabButton = ({ 
    icon: Icon, 
    label, 
    onPress, 
    isActive 
  }: {
    icon: any;
    label: string;
    onPress: () => void;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      className={`flex-1 items-center justify-center py-3 px-2 ${
        isActive ? 'bg-blue-50' : ''
      }`}
      onPress={onPress}
      style={{
        borderRadius: isActive ? 12 : 0,
        marginHorizontal: 4,
      }}
    >
      <View className={`p-2 rounded-full ${isActive ? 'bg-blue-600' : ''}`}>
        <Icon 
          size={22} 
          color={isActive ? '#ffffff' : '#64748b'} 
        />
      </View>
      <Text 
        className={`text-xs mt-1 font-medium ${
          isActive ? 'text-blue-600' : 'text-slate-500'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white border-t border-gray-200 shadow-lg">
      {/* Top accent line */}
      <View className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-600" />
      
      <View className="flex-row justify-between items-center px-2 py-2">
        <TabButton
          icon={House}
          label="Home"
          onPress={() => handleTabPress('Home', 'Home')}
          isActive={activeTab === 'Home'}
        />
        
        <TabButton
          icon={Info}
          label="About"
          onPress={() => handleTabPress('About', 'About')}
          isActive={activeTab === 'About'}
        />
        
        <TabButton
          icon={Contact}
          label="Contact"
          onPress={() => handleTabPress('Contact')}
          isActive={activeTab === 'Contact'}
        />
        
        <TabButton
          icon={Menu}
          label="Menu"
          onPress={() => handleTabPress('Menu')}
          isActive={activeTab === 'Menu'}
        />
      </View>
      
      {/* Safe area for devices with home indicator */}
      <View className="h-2" />
    </View>
  );
}

export default CustomTabBar;