import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export interface MatchTeam {
  code: string;
  name: string;
  flag: string;
  date?: string;
}

interface BracketMatchProps {
  team1: MatchTeam;
  team2: MatchTeam;
  matchDate?: string;
  round?: string;
}

export default function BracketMatch({ team1, team2, matchDate, round }: BracketMatchProps) {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {round && (
        <Text style={[styles.roundLabel, isDarkMode && styles.textDark]}>
          {round}
        </Text>
      )}
      <View style={[styles.matchContainer, isDarkMode && styles.matchContainerDark]}>
        <View style={styles.teamRow}>
          <Image 
            source={{ uri: team1.flag }} 
            style={styles.flag}
            resizeMode="contain"
          />
          <Text style={[styles.teamCode, isDarkMode && styles.textDark]}>{team1.code}</Text>
          <Text style={[styles.teamName, isDarkMode && styles.textDark]} numberOfLines={1}>
            {team1.name}
          </Text>
        </View>
        <View style={styles.teamRow}>
          <Image 
            source={{ uri: team2.flag }} 
            style={styles.flag}
            resizeMode="contain"
          />
          <Text style={[styles.teamCode, isDarkMode && styles.textDark]}>{team2.code}</Text>
          <Text style={[styles.teamName, isDarkMode && styles.textDark]} numberOfLines={1}>
            {team2.name}
          </Text>
        </View>
        {matchDate && (
          <Text style={[styles.date, isDarkMode && styles.dateDark]}>
            {matchDate}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
  },
  containerDark: {
    backgroundColor: '#1a1b1e',
  },
  roundLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  matchContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  matchContainerDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  teamCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1f2937',
    width: 40,
  },
  teamName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  textDark: {
    color: '#f3f4f6',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  dateDark: {
    color: '#9ca3af',
  },
}); 