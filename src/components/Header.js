// App header komponenti - Logo ve başlık ile
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';

export const AppHeader = ({ 
  title = "Kurmatik", 
  subtitle = "Döviz & Altın", 
  showLogo = true,
  style = undefined,
  rightComponent = null
}) => {
  const theme = useTheme();
  const [logoError, setLogoError] = useState(false);
  
  return (
    <View style={[
      styles.header,
      { backgroundColor: theme.colors.background },
      style
    ]}>
      <View style={styles.headerContent}>
        {showLogo && (
          <View style={styles.logoContainer}>
            {!logoError ? (
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
                onError={() => {
                  console.warn('AppHeader: failed to load logo asset');
                  setLogoError(true);
                }}
              />
            ) : (
              // Fallback: small circular icon with initials
              <View style={[styles.logoFallback, { backgroundColor: theme.colors.surface }]}> 
                <Text style={[styles.logoFallbackText, { color: theme.colors.textPrimary }]}>KM</Text>
              </View>
            )}
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
        {rightComponent && (
          <View style={styles.headerRight}>
            {rightComponent}
          </View>
        )}
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
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoContainer: {
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoFallback: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  logoFallbackText: {
    fontSize: 16,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 30 : 2,
    zIndex: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: 0.3,
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