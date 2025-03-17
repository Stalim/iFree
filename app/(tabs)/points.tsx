import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function ConfigurationTab() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Configuración</Text>
      
      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Apariencia</Text>
        </View>

        <TouchableOpacity 
          style={[styles.option, isDarkMode && styles.optionDark]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            {isDarkMode ? (
              <Moon size={24} color={isDarkMode ? '#f8fafc' : '#0f2167'} />
            ) : (
              <Sun size={24} color={isDarkMode ? '#f8fafc' : '#0f2167'} />
            )}
            <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>
              Modo oscuro
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={isDarkMode ? '#0f2167' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#1a1b1e',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#0f2167',
    marginBottom: 24,
  },
  titleDark: {
    color: '#f8fafc',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f2167',
  },
  sectionTitleDark: {
    color: '#f8fafc',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionDark: {
    borderTopColor: '#3a3b3e',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0f2167',
    marginLeft: 12,
  },
  optionTextDark: {
    color: '#f8fafc',
  },
}); 