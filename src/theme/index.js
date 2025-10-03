// Modern finans uygulaması tema sistemi
// Sabit dark theme kullanımı

// Ana renk paleti - Finans uygulaması için profesyonel renkler
const lightColors = {
  // Ana renkler
  primary: '#2563EB',        // Modern mavi
  primaryDark: '#1D4ED8',    // Koyu mavi
  primaryLight: '#3B82F6',   // Açık mavi
  
  // İkincil renkler
  secondary: '#10B981',      // Yeşil (pozitif değişim)
  danger: '#EF4444',         // Kırmızı (negatif değişim)
  warning: '#F59E0B',        // Turuncu (uyarı)
  
  // Altın renkleri
  gold: '#FFD700',           // Altın
  goldDark: '#DAA520',       // Koyu altın
  goldLight: '#FFF8DC',      // Açık altın arkaplan
  
  // Nötr renkler
  background: '#FFFFFF',     // Ana arkaplan
  surface: '#F8FAFC',        // Card arkaplanları
  surfaceElevated: '#FFFFFF', // Yükseltilmiş yüzeyler
  
  // Metin renkleri
  textPrimary: '#1F2937',    // Ana metin
  textSecondary: '#6B7280',  // İkincil metin
  textTertiary: '#9CA3AF',   // Üçüncül metin
  textInverse: '#FFFFFF',    // Ters metin (koyu arkaplan üzerinde)
  
  // Kenarlık ve ayırıcılar
  border: '#E5E7EB',         // Ana kenarlık
  borderLight: '#F3F4F6',    // Açık kenarlık
  borderDark: '#D1D5DB',     // Koyu kenarlık
  
  // Durumlar
  success: '#10B981',        // Başarı
  error: '#EF4444',          // Hata
  info: '#3B82F6',          // Bilgi
  
  // Gölgeler
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

const darkColors = {
  // Ana renkler
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  
  // İkincil renkler
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  
  // Altın renkleri
  gold: '#FFD700',
  goldDark: '#DAA520',
  goldLight: '#2D2A1F',
  
  // Nötr renkler
  background: '#111827',     // Ana arkaplan
  surface: '#1F2937',        // Card arkaplanları
  surfaceElevated: '#374151', // Yükseltilmiş yüzeyler
  
  // Metin renkleri
  textPrimary: '#F9FAFB',    // Ana metin
  textSecondary: '#D1D5DB',  // İkincil metin
  textTertiary: '#9CA3AF',   // Üçüncül metin
  textInverse: '#1F2937',    // Ters metin
  
  // Kenarlık ve ayırıcılar
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',
  
  // Durumlar
  success: '#10B981',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gölgeler
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.4)',
};

// Tipografi
const typography = {
  // Font aileleri
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'Courier New', // Rakamlar için
  },
  
  // Font boyutları
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Satır yükseklikleri
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  
  // Font ağırlıkları
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing sistemi
const spacing = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
};

// Border radius
const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Gölge stilleri
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Ana tema objesi
const createTheme = (isDark = false) => ({
  colors: isDark ? darkColors : lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark,
});

// Hook kullanımı için - Sabit dark theme
export const useTheme = () => {
  return createTheme(true); // Her zaman dark theme
};

// Statik tema erişimi
export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

export default { lightTheme, darkTheme, useTheme };