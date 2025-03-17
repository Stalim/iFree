import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getKnockoutStage, KnockoutStage, Match as MatchType } from '@/services/knockoutService';
import TournamentBracket from '@/components/TournamentBracket';

interface KnockoutPhaseProps {
  leagueId: string;
  isDarkMode: boolean;
}

export default function KnockoutPhase({ leagueId, isDarkMode }: KnockoutPhaseProps) {
  const [knockoutData, setKnockoutData] = useState<KnockoutStage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnockoutData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getKnockoutStage(leagueId);
        setKnockoutData(data);
      } catch (err) {
        console.error(`Error fetching knockout stage for league ${leagueId}:`, err);
        setError('No se pudo cargar la fase de eliminación directa');
      } finally {
        setLoading(false);
      }
    };

    fetchKnockoutData();
  }, [leagueId]);

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#0f2167'} />
      </View>
    );
  }

  if (error || !knockoutData) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <Text style={[styles.errorText, isDarkMode && styles.textDark]}>
          {error || 'No hay datos disponibles para la fase de eliminación directa'}
        </Text>
      </View>
    );
  }

  // Transform knockout data for TournamentBracket component
  const transformedRounds = knockoutData.rounds.map(round => {
    return {
      name: round.name,
      matches: round.matches.map(match => {
        // Ensure we have a flag for each competitor
        const flag1 = match.competitor1.flag || '🌎';
        const flag2 = match.competitor2.flag || '🌎';
        
        return {
          team1: {
            code: match.competitor1.name === 'Por definir' ? 'TBD' : match.competitor1.name.substring(0, 10),
            name: match.competitor1.name === 'Por definir' ? 'TBD' : match.competitor1.name,
            flag: match.competitor1.name === 'Por definir' ? '🌎' : flag1,
            date: new Date(match.date).toLocaleDateString()
          },
          team2: {
            code: match.competitor2.name === 'Por definir' ? 'TBD' : match.competitor2.name.substring(0, 10),
            name: match.competitor2.name === 'Por definir' ? 'TBD' : match.competitor2.name,
            flag: match.competitor2.name === 'Por definir' ? '🌎' : flag2,
            date: new Date(match.date).toLocaleDateString()
          },
          date: new Date(match.date).toLocaleDateString()
        };
      })
    };
  });

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <TournamentBracket 
        rounds={transformedRounds} 
        title={knockoutData.title} 
      />
    </View>
  );
}

interface MatchProps {
  match: MatchType;
  isDarkMode: boolean;
  isCurrentRound: boolean;
}

function Match({ match, isDarkMode, isCurrentRound }: MatchProps) {
  // Format date
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Check if match is TBD (To Be Determined)
  const isTBD = match.competitor1.id === 'tbd' || match.competitor2.id === 'tbd';
  
  // Check if match has a winner
  const hasWinner = match.winner !== null;
  
  // Determine styles based on winner
  const comp1Style = match.winner === match.competitor1.id ? styles.winnerName : styles.competitorName;
  const comp2Style = match.winner === match.competitor2.id ? styles.winnerName : styles.competitorName;
  
  return (
    <View style={[
      styles.matchCard, 
      isDarkMode && styles.matchCardDark,
      isCurrentRound && styles.currentRoundMatch,
      isCurrentRound && isDarkMode && styles.currentRoundMatchDark,
      isTBD && styles.tbdMatch,
      isTBD && isDarkMode && styles.tbdMatchDark
    ]}>
      <View style={styles.matchHeader}>
        <Text style={[styles.matchDate, isDarkMode && styles.textDark]}>
          {formattedDate}
        </Text>
      </View>
      
      <View style={styles.competitorsContainer}>
        <View style={styles.competitorRow}>
          <Text style={[comp1Style, isDarkMode && styles.textDark]}>
            {match.competitor1.flag} {match.competitor1.name}
          </Text>
          {!isTBD && (
            <Text style={[styles.score, isDarkMode && styles.textDark]}>
              {match.score1}
            </Text>
          )}
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, isDarkMode && styles.textSecondaryDark]}>VS</Text>
        </View>
        
        <View style={styles.competitorRow}>
          <Text style={[comp2Style, isDarkMode && styles.textDark]}>
            {match.competitor2.flag} {match.competitor2.name}
          </Text>
          {!isTBD && (
            <Text style={[styles.score, isDarkMode && styles.textDark]}>
              {match.score2}
            </Text>
          )}
        </View>
      </View>
      
      {hasWinner && (
        <View style={[styles.winnerBadge, isDarkMode && styles.winnerBadgeDark]}>
          <Text style={styles.winnerBadgeText}>
            Ganador
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 8, // Reduced padding to give more space for the bracket
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ef4444',
    textAlign: 'center',
  },
  textDark: {
    color: '#ffffff',
  },
  bracketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  roundColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roundTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  matchesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  matchCard: {
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  matchCardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#2d2d2d',
  },
  currentRoundMatch: {
    borderColor: '#0f2167',
    borderWidth: 2,
    backgroundColor: '#f0f9ff',
  },
  currentRoundMatchDark: {
    borderColor: '#93c5fd',
    backgroundColor: '#0c4a6e',
  },
  tbdMatch: {
    opacity: 0.7,
    backgroundColor: '#f9fafb',
  },
  tbdMatchDark: {
    backgroundColor: '#262626',
  },
  matchHeader: {
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  competitorsContainer: {
    marginVertical: 8,
  },
  competitorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  competitorName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    flex: 1,
  },
  winnerName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0f2167',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginLeft: 8,
    width: 24,
    textAlign: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  winnerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0f2167',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  winnerBadgeDark: {
    backgroundColor: '#93c5fd',
  },
  winnerBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
}); 