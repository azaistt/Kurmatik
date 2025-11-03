import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnifiedFinancePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unified Finance Page</Text>
      {/* Add Kurmatik currency converter here */}
      <View style={styles.converterSection}>
        <Text>Kurmatik Currency Converter</Text>
      </View>
      {/* Add StockBot financial data here */}
      <View style={styles.stockBotSection}>
        <Text>StockBot Financial Data</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  converterSection: {
    flex: 1,
    marginBottom: 16,
  },
  stockBotSection: {
    flex: 1,
  },
});

export default UnifiedFinancePage;