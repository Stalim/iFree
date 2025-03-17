import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DateBarProps {
  currentDate: Date;
  onDateChange: (direction: 'next' | 'previous') => void;
  isDarkMode: boolean;
  hasNextEvent: boolean;
  hasPreviousEvent: boolean;
}

export default function DateBar({ 
  currentDate, 
  onDateChange, 
  isDarkMode,
  hasNextEvent,
  hasPreviousEvent 
}: DateBarProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const horizontalSwipe = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX > 50 && hasPreviousEvent) {
        onDateChange('previous');
      } else if (event.translationX < -50 && hasNextEvent) {
        onDateChange('next');
      }
    });

  return (
    <GestureDetector gesture={horizontalSwipe}>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <TouchableOpacity 
          onPress={() => hasPreviousEvent && onDateChange('previous')}
          style={[styles.button, !hasPreviousEvent && styles.buttonDisabled]}
          disabled={!hasPreviousEvent}
        >
          <ChevronLeft 
            size={24} 
            color={hasPreviousEvent 
              ? (isDarkMode ? '#f8fafc' : '#0f2167')
              : (isDarkMode ? '#4a5568' : '#cbd5e0')
            } 
          />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
            {formatDate(currentDate)}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => hasNextEvent && onDateChange('next')}
          style={[styles.button, !hasNextEvent && styles.buttonDisabled]}
          disabled={!hasNextEvent}
        >
          <ChevronRight 
            size={24} 
            color={hasNextEvent 
              ? (isDarkMode ? '#f8fafc' : '#0f2167')
              : (isDarkMode ? '#4a5568' : '#cbd5e0')
            } 
          />
        </TouchableOpacity>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    zIndex: 1,
  },
  containerDark: {
    backgroundColor: '#1a1b1e',
    borderBottomColor: '#3a3b3e',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f2167',
    textTransform: 'capitalize',
  },
  dateTextDark: {
    color: '#f8fafc',
  },
  button: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 