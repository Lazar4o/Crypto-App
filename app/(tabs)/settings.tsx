import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExternalLink, Moon, Sun, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const openCoingecko = () => {
    Linking.openURL('https://www.coingecko.com/');
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>
      
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
        </View>
        
        <View style={[styles.setting, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            {theme === 'dark' ? (
              <Moon size={20} color={colors.text} />
            ) : (
              <Sun size={20} color={colors.text} />
            )}
            <Text style={[styles.settingText, { color: colors.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>
      
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
        </View>
        
        <Pressable 
          style={[styles.setting, { borderBottomColor: colors.border }]}
          onPress={openCoingecko}
        >
          <View style={styles.settingInfo}>
            <ExternalLink size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              CoinGecko API
            </Text>
          </View>
          <ExternalLink size={20} color={colors.primary} />
        </Pressable>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              App Version
            </Text>
          </View>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            1.0.0
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          CryptoPulse © 2025
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Cryptocurrency data provided by CoinGecko
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
});