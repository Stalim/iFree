import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getAllPlayers } from '@/services/playerService';
import { PlayerInfo } from '@/components/PlayerProfile';
import { useTheme } from '@/context/ThemeContext';

export default function PlayersScreen() {
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const data = await getAllPlayers();
        setPlayers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load players:', err);
        setError('Failed to load players. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const handlePlayerPress = (playerId: string) => {
    router.push(`/players/${playerId}`);
  };

  const renderPlayerItem = ({ item }: { item: PlayerInfo }) => (
    <TouchableOpacity 
      style={[styles.playerCard, isDarkMode && styles.playerCardDark]} 
      onPress={() => handlePlayerPress(item.id)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.playerImage}
        resizeMode="cover"
      />
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, isDarkMode && styles.textDark]}>{item.name}</Text>
        <Text style={[styles.playerDetails, isDarkMode && styles.textSecondaryDark]}>
          {item.nationality} • {item.age} años
        </Text>
        <Text style={[styles.playerStyle, isDarkMode && styles.textAccentDark]}>
          {item.rapStyle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Freestylers',
          headerStyle: {
            backgroundColor: isDarkMode ? '#1a1b1e' : '#ffffff',
          },
          headerTintColor: isDarkMode ? '#f8fafc' : '#1f2937',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
        }} 
      />
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#6366f1'} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, isDarkMode && styles.textDark]}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={players}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerCardDark: {
    backgroundColor: '#2a2b2e',
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  playerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 4,
  },
  playerDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  playerStyle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6366f1',
  },
  textDark: {
    color: '#f8fafc',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  textAccentDark: {
    color: '#93c5fd',
  },
}); 