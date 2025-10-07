const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Web platformu için react-native-google-mobile-ads'ı devre dışı bırak
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-google-mobile-ads') {
    return {
      type: 'empty',
    };
  }

  // Diğer modüller için varsayılan davranışı kullan
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;