import { View, StyleSheet, Animated, Dimensions, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DateBar from '@/components/DateBar';
import EventFlyer from '@/components/EventFlyer';
import { Event } from '@/data/events';
import { useTheme } from '../../context/ThemeContext';
import { API_URL, API_CONFIG, SERVER_BASE_URL } from '@/config';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

interface MongoEvent extends Omit<Event, 'id'> {
  _id: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function EventosTab() {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const { isDarkMode } = useTheme();

  const fetchEvents = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching events from:', `${API_URL}/events`);
      console.log('Attempt:', retryCount + 1);
      
      const response = await fetchWithTimeout(`${API_URL}/events`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }

      const data: MongoEvent[] = await response.json();
      console.log('Fetched events:', data);
      
      // Convert MongoDB documents to Event objects and sort by date
      const eventsWithDates = data.map(event => ({
        id: event._id,
        title: event.title,
        date: new Date(event.date),
        description: event.description,
        location: event.location,
        time: event.time,
        imageUrl: event.imageUrl.startsWith('http') 
          ? event.imageUrl 
          : `${SERVER_BASE_URL}${event.imageUrl}`
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
      
      console.log('Processed events:', eventsWithDates);
      setAllEvents(eventsWithDates);
      
      // Set initial event index to the first event that's today or after
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const initialIndex = Math.max(0, eventsWithDates.findIndex(event => 
        event.date.getTime() >= today.getTime()
      ));
      setCurrentEventIndex(initialIndex === -1 ? 0 : initialIndex);
    } catch (err) {
      console.error('Error fetching events:', err);
      
      if (retryCount < API_CONFIG.RETRY_ATTEMPTS - 1) {
        console.log(`Retrying in ${API_CONFIG.RETRY_DELAY_MS}ms...`);
        await delay(API_CONFIG.RETRY_DELAY_MS);
        return fetchEvents(retryCount + 1);
      }
      
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const currentEvent = allEvents[currentEventIndex];

  const navigateToEvent = (direction: 'next' | 'previous') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentEventIndex + 1, allEvents.length - 1)
      : Math.max(currentEventIndex - 1, 0);
    
    if (newIndex !== currentEventIndex) {
      setCurrentEventIndex(newIndex);
    }
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      translateX.setValue(event.translationX);
      opacity.setValue(1 - Math.min(Math.abs(event.translationX) / (width / 2), 0.5));
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD && currentEventIndex < allEvents.length - 1) {
        // Swiped left - next event
        Animated.timing(translateX, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          navigateToEvent('next');
          translateX.setValue(0);
          opacity.setValue(1);
        });
      } else if (event.translationX > SWIPE_THRESHOLD && currentEventIndex > 0) {
        // Swiped right - previous event
        Animated.timing(translateX, {
          toValue: width,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          navigateToEvent('previous');
          translateX.setValue(0);
          opacity.setValue(1);
        });
      } else {
        resetPosition();
      }
    });

  const handleDateChange = (direction: 'next' | 'previous') => {
    navigateToEvent(direction);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      color: isDarkMode ? '#ff6b6b' : '#dc3545',
      textAlign: 'center',
      marginBottom: 10,
    },
    retryButton: {
      padding: 10,
      backgroundColor: isDarkMode ? '#2c2c2c' : '#e9ecef',
      borderRadius: 5,
    },
    retryText: {
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    contentContainer: {
      flex: 1,
    },
    noEventsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    noEventsText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: isDarkMode ? '#f8fafc' : '#1f2937',
      textAlign: 'center',
    }
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#000000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <View style={styles.retryButton}>
          <Text 
            style={styles.retryText} 
            onPress={() => fetchEvents(0)}
          >
            Retry
          </Text>
        </View>
      </View>
    );
  }

  if (allEvents.length === 0) {
    return (
      <View style={[styles.container, styles.noEventsContainer]}>
        <Text style={styles.noEventsText}>No hay eventos programados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateBar 
        currentDate={currentEvent.date}
        onDateChange={(direction) => handleDateChange(direction)}
        isDarkMode={isDarkMode}
        hasNextEvent={currentEventIndex < allEvents.length - 1}
        hasPreviousEvent={currentEventIndex > 0}
      />
      
      <GestureDetector gesture={swipeGesture}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              transform: [{ translateX }],
              opacity,
            }
          ]}
        >
          <EventFlyer 
            event={currentEvent}
            isDarkMode={isDarkMode}
          />
        </Animated.View>
      </GestureDetector>
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
  },
  contentContainer: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Inter-Regular',
  },
  errorTextDark: {
    color: '#f87171',
  },
});