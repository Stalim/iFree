import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { UPLOADS_URL, SERVER_BASE_URL } from '@/config';

// Helper function to get country flag emoji
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'México': '🇲🇽',
    'España': '🇪🇸',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Perú': '🇵🇪',
    'Colombia': '🇨🇴',
    'Venezuela': '🇻🇪',
  };
  return flags[country] || '🌎';
};

// Helper function to get full image URL
const getFullImageUrl = (url: string): string => {
  if (!url) return '';
  // If the URL already starts with http, it's already a full URL
  if (url.startsWith('http')) return url;
  // If it's a relative URL (starts with /uploads), prepend the server URL
  if (url.startsWith('/uploads')) return `${SERVER_BASE_URL}${url}`;
  return url;
};

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  imageUrl: string;
  bannerUrl: string;
  age: number;
  nationality: string;
  rapStyle: string;
  stats: PlayerStats;
  achievements: string[];
  description: string;
}

interface PlayerProfileProps {
  player: PlayerInfo;
  isDarkMode: boolean;
}

export default function PlayerProfile({ player, isDarkMode }: PlayerProfileProps) {
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [bannerImageLoading, setBannerImageLoading] = useState(false);
  const [bannerImageError, setBannerImageError] = useState(false);
  
  // Get full image URLs
  const profileImageUrl = getFullImageUrl(player.imageUrl);
  const bannerImageUrl = getFullImageUrl(player.bannerUrl);
  
  console.log('Player data:', player);
  console.log('Profile Image URL:', profileImageUrl);
  console.log('Banner Image URL:', bannerImageUrl);

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Banner Image */}
      <View style={[styles.bannerContainer, isDarkMode && styles.bannerContainerDark]}>
        <Image 
          source={{ uri: bannerImageUrl }} 
          style={styles.bannerImage}
          onLoadStart={() => setBannerImageLoading(true)}
          onLoadEnd={() => setBannerImageLoading(false)}
          onError={(e) => {
            console.error('Banner image error:', e.nativeEvent.error);
            setBannerImageError(true);
            setBannerImageLoading(false);
          }}
        />
        {bannerImageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#0f2167'} />
          </View>
        )}
        {bannerImageError && (
          <View style={styles.imageErrorContainer}>
            <Text style={[styles.imageErrorText, isDarkMode && styles.textDark]}>
              Error loading banner image
            </Text>
          </View>
        )}
        <View style={[styles.bannerOverlay, isDarkMode && styles.bannerOverlayDark]} />
      </View>

      {/* Profile Image */}
      <View style={[styles.profileImageContainer, isDarkMode && styles.profileImageContainerDark]}>
        <Image 
          source={{ uri: profileImageUrl }} 
          style={styles.profileImage}
          resizeMode="cover"
          onLoadStart={() => setProfileImageLoading(true)}
          onLoadEnd={() => setProfileImageLoading(false)}
          onError={(e) => {
            console.error('Profile image error:', e.nativeEvent.error);
            setProfileImageError(true);
            setProfileImageLoading(false);
          }}
        />
        {profileImageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="small" color={isDarkMode ? '#93c5fd' : '#0f2167'} />
          </View>
        )}
        {profileImageError && (
          <View style={styles.imageErrorContainer}>
            <Text style={[styles.imageErrorText, isDarkMode && styles.textDark]}>
              Error
            </Text>
          </View>
        )}
      </View>

      {/* Header Info */}
      <View style={[styles.headerInfo, isDarkMode && styles.headerInfoDark]}>
        <Text style={[styles.name, isDarkMode && styles.textDark]}>{player.name}</Text>
        <Text style={[styles.basicInfo, isDarkMode && styles.textDark]}>
          {player.age} años {getCountryFlag(player.nationality)}
        </Text>
        <Text style={[styles.style, isDarkMode && styles.textDark]}>
          Estilo: {player.rapStyle}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={[styles.statsContainer, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDarkMode && styles.textDark]}>
              {player.stats.wins + player.stats.losses + player.stats.draws}
            </Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textSecondaryDark]}>Batallas Totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDarkMode && styles.textDark]}>{player.stats.wins}</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textSecondaryDark]}>Victorias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDarkMode && styles.textDark]}>{player.stats.losses}</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textSecondaryDark]}>Derrotas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDarkMode && styles.textDark]}>{player.stats.winRate}%</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textSecondaryDark]}>Ratio Victoria</Text>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Logros</Text>
        {player.achievements.map((achievement, index) => (
          <Text key={index} style={[styles.achievementItem, isDarkMode && styles.textDark]}>
            • {achievement}
          </Text>
        ))}
      </View>

      {/* Description Section */}
      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Biografía</Text>
        <Text style={[styles.description, isDarkMode && styles.textDark]}>
          {player.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8fafc',
    marginBottom: 0,
    overflow: 'hidden',
  },
  bannerContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bannerOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: -30,
    marginLeft: 24,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
  },
  profileImageContainerDark: {
    borderColor: '#121212',
    backgroundColor: '#121212',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  imageErrorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageErrorText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  headerInfo: {
    padding: 20,
    paddingTop: 20,
    paddingLeft: 160,
    paddingRight: 24,
    marginTop: -90,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerInfoDark: {
    backgroundColor: '#121212',
    borderBottomWidth: 0,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  basicInfo: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: 8,
  },
  style: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  trophyItem: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 8,
  },
  achievementItem: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
    lineHeight: 24,
  },
  textDark: {
    color: '#ffffff',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
}); 