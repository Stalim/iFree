import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { League } from '@/data/leagues';

interface LeagueItemProps {
  league: League;
}

export default function LeagueItem({ league }: LeagueItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(leagues)/[id]",
      params: { id: league.id }
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: league.logoUrl }} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.name}>{league.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
}); 