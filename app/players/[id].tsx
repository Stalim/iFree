import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getPlayerById } from '@/services/playerService';
import PlayerProfile, { PlayerInfo } from '@/components/PlayerProfile';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadPlayer = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getPlayerById(id);
        setPlayer(data);
        setError(null);
      } catch (err) {
        console.error(`Failed to load player with ID ${id}:`, err);
        setError('Failed to load player data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: player?.name || 'Perfil de Freestyler',
          headerStyle: {
            backgroundColor: isDarkMode ? '#1a1b1e' : '#ffffff',
          },
          headerTintColor: isDarkMode ? '#f8fafc' : '#1f2937',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ArrowLeft size={24} color={isDarkMode ? '#f8fafc' : '#1f2937'} />
            </TouchableOpacity>
          ),
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
        ) : player ? (
          <PlayerProfile player={player} isDarkMode={isDarkMode} />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, isDarkMode && styles.textDark]}>
              No se encontró el perfil del freestyler
            </Text>
          </View>
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
  textDark: {
    color: '#f8fafc',
  },
  backButton: {
    padding: 8,
  },
}); 