import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import KnockoutPhase from '@/components/KnockoutPhase';

export default function Knockout() {
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <KnockoutPhase 
        leagueId={id as string}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#1a1b1e',
  }
}); 