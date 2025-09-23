// App header komponenti - Logo ve başlık ile
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';

export const AppHeader = ({ 
  title = "Kurmatik", 
  subtitle = "Döviz & Altın", 
  showLogo = true,
  style 
}) => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.header,
      { backgroundColor: theme.colors.background },
      style
    ]}>
      <View style={styles.headerContent}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={[
                styles.logo,
                { tintColor: theme.colors.primary }
              ]}
              resizeMode="contain"
            />
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            { color: theme.colors.textPrimary }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: theme.colors.textSecondary }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={[
        styles.divider,
        { backgroundColor: theme.colors.border }
      ]} />
    </View>
  );
};

// Sayfa başlığı komponenti
export const PageHeader = ({ 
  title, 
  subtitle, 
  rightComponent,
  showBackButton = false,
  onBackPress,
  style 
}) => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.pageHeader,
      { backgroundColor: theme.colors.surface },
      style
    ]}>
      <View style={styles.pageHeaderContent}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Text style={[
              styles.backButtonText,
              { color: theme.colors.primary }
            ]}>
              ← Geri
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.pageHeaderText}>
          <Text style={[
            styles.pageTitle,
            { color: theme.colors.textPrimary }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.pageSubtitle,
              { color: theme.colors.textSecondary }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightComponent && (
          <View style={styles.pageHeaderRight}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

// Status bar için yardımcı komponent
export const StatusBarSpacer = () => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.statusBarSpacer,
      { backgroundColor: theme.colors.background }
    ]} />
  );
};

const styles = StyleSheet.create({
  // Ana header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: 16,
  },
  
  // Sayfa başlığı
  pageHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pageHeaderText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 14,
  },
  pageHeaderRight: {
    marginLeft: 12,
  },
  
  // Status bar spacer
  statusBarSpacer: {
    height: Platform.OS === 'ios' ? 50 : 20,
  },
});

export default {
  AppHeader,
  PageHeader,
  StatusBarSpacer,
};