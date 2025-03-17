import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Clock, ImageOff } from 'lucide-react-native';
import { Event } from '@/data/events';

interface EventFlyerProps {
  event: Event | null;
  isDarkMode: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function EventFlyer({ event, isDarkMode }: EventFlyerProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!event) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={[styles.noEventCard, isDarkMode && styles.noEventCardDark]}>
          <Text style={[styles.noEventText, isDarkMode && styles.noEventTextDark]}>No hay eventos para esta fecha</Text>
          <Text style={[styles.noEventSubtext, isDarkMode && styles.noEventSubtextDark]}>Intenta con otra fecha</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={[styles.imageContainer, isDarkMode && styles.imageContainerDark]}>
          <Image 
            source={{ uri: event.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => {
              setImageLoading(true);
              setImageError(false);
            }}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
              console.error('Error loading image:', event.imageUrl);
            }}
          />
          {imageLoading && (
            <View style={styles.imageOverlay}>
              <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#6366f1'} />
            </View>
          )}
          {imageError && (
            <View style={styles.imageOverlay}>
              <ImageOff size={48} color={isDarkMode ? '#93c5fd' : '#6366f1'} />
              <Text style={[styles.imageErrorText, isDarkMode && styles.imageErrorTextDark]}>
                Error al cargar la imagen
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.contentContainer, isDarkMode && styles.contentContainerDark]}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>{event.title}</Text>
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>{event.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MapPin size={18} color={isDarkMode ? '#93c5fd' : '#6366f1'} />
              <Text style={[styles.detailText, isDarkMode && styles.detailTextDark]}>{event.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color={isDarkMode ? '#93c5fd' : '#6366f1'} />
              <Text style={[styles.detailText, isDarkMode && styles.detailTextDark]}>{event.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#1a1b1e',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f2167',
  },
  cardDark: {
    backgroundColor: '#2a2b2e',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  imageContainerDark: {
    backgroundColor: '#2a2b2e',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  contentContainerDark: {
    backgroundColor: '#2a2b2e',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 8,
  },
  titleDark: {
    color: '#f8fafc',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#9ca3af',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  detailTextDark: {
    color: '#9ca3af',
  },
  noEventCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noEventCardDark: {
    backgroundColor: '#2a2b2e',
  },
  noEventText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noEventTextDark: {
    color: '#f8fafc',
  },
  noEventSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  noEventSubtextDark: {
    color: '#9ca3af',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  imageErrorText: {
    marginTop: 8,
    color: '#6366f1',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  imageErrorTextDark: {
    color: '#93c5fd',
  },
}); 