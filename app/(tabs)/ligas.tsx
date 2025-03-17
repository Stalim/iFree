import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Search, Star, StarOff } from 'lucide-react-native';
import { leagues } from '@/data/leagues';
import { League } from '@/data/leagues';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

export default function LigasTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();

  const filteredLeagues = leagues.filter(league => 
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (league.country && league.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLeaguePress = (league: League) => {
    router.push({
      pathname: "/(leagues)/[id]",
      params: { id: league.id }
    });
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Ligas</Text>
      
      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Search size={18} color={isDarkMode ? '#9ca3af' : '#6b7280'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder="Buscar ligas"
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Seguir</Text>
      </View>
      
      <FlatList
        data={filteredLeagues}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.leagueItem, isDarkMode && styles.leagueItemDark]}
            onPress={() => handleLeaguePress(item)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: item.logoUrl }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={[styles.leagueName, isDarkMode && styles.leagueNameDark]}>{item.name}</Text>
              {item.country && (
                <Text style={[styles.countryName, isDarkMode && styles.countryNameDark]}>{item.country}</Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              style={styles.favoriteButton}
            >
              {favorites.includes(item.id) ? (
                <Star size={24} color={isDarkMode ? '#93c5fd' : '#0f2167'} fill={isDarkMode ? '#93c5fd' : '#0f2167'} />
              ) : (
                <StarOff size={24} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
    marginBottom: 16,
  },
  titleDark: {
    color: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchContainerDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#0f2167',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  searchInputDark: {
    color: '#f8fafc',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    paddingRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0f2167',
  },
  sectionTitleDark: {
    color: '#f8fafc',
  },
  listContent: {
    paddingBottom: 16,
  },
  leagueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leagueItemDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
  },
  leagueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0f2167',
  },
  leagueNameDark: {
    color: '#f8fafc',
  },
  countryName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  countryNameDark: {
    color: '#9ca3af',
  },
  favoriteButton: {
    padding: 8,
  },
}); 