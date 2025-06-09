import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Activity, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  const { theme, colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: theme === 'dark' ? 'transparent' : colors.border,
          elevation: theme === 'dark' ? 0 : 2,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'CryptoPulse',
          tabBarLabel: 'Market',
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});