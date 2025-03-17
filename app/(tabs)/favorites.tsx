import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { leagues } from '@/data/leagues';
import { League } from '@/data/leagues';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

export default function FavoritosTab() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { favorites } = useFavorites();

  const favoriteLeagues = leagues.filter(league => favorites.includes(league.id));

  const handleLeaguePress = (league: League) => {
    router.push({
      pathname: "/(leagues)/[id]",
      params: { id: league.id }
    });
  };

  const renderLeagueItem = ({ item }: { item: League }) => (
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
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Favoritos</Text>
      
      {favoriteLeagues.length === 0 ? (
        <View style={[styles.emptyContainer, isDarkMode && styles.emptyContainerDark]}>
          <Star size={48} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>No tienes ligas favoritas</Text>
          <Text style={[styles.emptySubtext, isDarkMode && styles.emptySubtextDark]}>Agrega ligas desde la pestaña Ligas</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteLeagues}
          renderItem={renderLeagueItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyContainerDark: {
    backgroundColor: '#1a1b1e',
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  emptyTextDark: {
    color: '#9ca3af',
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  emptySubtextDark: {
    color: '#6b7280',
  },
}); 