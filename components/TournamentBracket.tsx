import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Svg, { Line } from 'react-native-svg';

interface Team {
  code: string;
  name: string;
  flag: string;
  date?: string;
}

interface Match {
  team1: Team;
  team2: Team;
  date: string;
}

interface Round {
  name: string;
  matches: Match[];
}

interface TournamentBracketProps {
  rounds: Round[];
  title: string;
}

export default function TournamentBracket({ rounds, title }: TournamentBracketProps) {
  const { isDarkMode } = useTheme();
  const { width } = Dimensions.get('window');

  const renderTeam = (team: Team, isWinner: boolean = false, isQuarterFinal: boolean = false) => {
    const isTBD = team.code === 'TBD';
    return (
      <View style={[
        styles.teamContainer,
        isDarkMode && styles.teamContainerDark,
        isWinner && styles.winnerContainer,
        isDarkMode && isWinner && styles.winnerContainerDark,
        isQuarterFinal && styles.quarterFinalTeam,
        isTBD && styles.tbdContainer,
        isTBD && isDarkMode && styles.tbdContainerDark
      ]}>
        <Text style={[styles.flagText, isQuarterFinal && styles.quarterFinalFlag]}>
          {team.flag}
        </Text>
        <Text style={[
          isTBD ? styles.tbdText : styles.teamCode,
          isDarkMode && styles.textDark,
          isWinner && styles.winnerText,
          isQuarterFinal && styles.quarterFinalText
        ]}>
          {team.code}
        </Text>
      </View>
    );
  };

  const renderMatch = (match: Match, index: number, roundIndex: number) => (
    <View style={styles.matchWrapper}>
      <View style={[
        styles.matchContainer, 
        isDarkMode && styles.matchContainerDark,
        roundIndex === 0 && styles.quarterFinalMatch
      ]}>
        <View style={styles.matchTeams}>
          {roundIndex === 0 ? (
            <>
              {renderTeam(match.team1, false, true)}
              <View style={styles.vsRowCentered}>
                <Text style={[styles.vsText, isDarkMode && styles.vsTextDark, styles.quarterFinalVs]}>vs</Text>
              </View>
              {renderTeam(match.team2, false, true)}
            </>
          ) : roundIndex === 1 ? (
            <>
              {renderTeam(match.team1)}
              <View style={styles.vsRowCentered}>
                <Text style={[styles.vsText, isDarkMode && styles.vsTextDark]}>vs</Text>
              </View>
              {renderTeam(match.team2)}
            </>
          ) : (
            <>
              {renderTeam({ code: 'TBD', name: 'TBD', flag: '🌎', date: '' })}
              <View style={styles.vsRowCentered}>
                <Text style={[styles.vsText, isDarkMode && styles.vsTextDark]}>vs</Text>
              </View>
              {renderTeam({ code: 'TBD', name: 'TBD', flag: '🌎', date: '' })}
            </>
          )}
        </View>
      </View>
    </View>
  );

  // Create connector lines between rounds
  const renderConnector = (direction: 'down' | 'up') => (
    <View style={styles.connectorContainer}>
      <Svg height="15" width="2" style={styles.connector}>
        <Line
          x1="1"
          y1={direction === 'down' ? "0" : "15"}
          x2="1"
          y2={direction === 'down' ? "15" : "0"}
          stroke={isDarkMode ? '#3a3b3e' : '#e2e8f0'}
          strokeWidth="1"
        />
      </Svg>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.bracketContainer}>
        {/* Top Quarter-Finals */}
        <View style={styles.roundColumn}>
          <View style={styles.quarterFinalsContainer}>
            {rounds[0].matches.slice(0, 4).map((match, matchIndex) => (
              <View key={matchIndex} style={styles.matchWrapper}>
                {renderMatch(match, matchIndex, 0)}
              </View>
            ))}
          </View>
        </View>

        {/* Top Semi-Finals Title */}
        <View style={[styles.titleContainer, styles.sectionSpacing]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
            {rounds[1].name}
          </Text>
        </View>

        {/* Top Semi-Finals */}
        <View style={[styles.roundColumn, styles.semiFinalsColumn]}>
          <View style={styles.semiFinalsContainer}>
            {rounds[1].matches.slice(0, 2).map((match, matchIndex) => (
              <View key={matchIndex} style={styles.matchWrapper}>
                {renderMatch(match, matchIndex, 1)}
              </View>
            ))}
          </View>
        </View>

        {/* Center section with Final */}
        <View style={styles.centerSection}>
          {/* Final Title */}
          <View style={styles.finalTitleContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
              {rounds[2].name}
            </Text>
          </View>
          
          {/* Final Match */}
          <View style={styles.finalMatchWrapper}>
            {renderMatch(rounds[2].matches[0], 0, 2)}
          </View>
        </View>

        {/* Bottom Semi-Finals */}
        <View style={[styles.roundColumn, styles.semiFinalsColumn]}>
          <View style={styles.semiFinalsContainer}>
            {rounds[1].matches.slice(0, 2).map((match, matchIndex) => (
              <View key={`bottom-semi-${matchIndex}`} style={styles.matchWrapper}>
                {renderMatch(match, matchIndex, 1)}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Semi-Finals Title - Moved between matches */}
        <View style={[styles.titleContainer, styles.sectionSpacing]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
            {rounds[1].name}
          </Text>
        </View>

        {/* Bottom Quarter-Finals */}
        <View style={styles.roundColumn}>
          <View style={styles.quarterFinalsContainer}>
            {rounds[0].matches.slice(0, 4).map((match, matchIndex) => (
              <View key={`bottom-${matchIndex}`} style={styles.matchWrapper}>
                {renderMatch(match, matchIndex, 0)}
              </View>
            ))}
          </View>
        </View>
        
        {/* Bottom Cuartos de Final Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
            {rounds[0].name}
          </Text>
        </View>
      </View>
    </ScrollView>
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
  bracketContainer: {
    padding: 8,
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
  },
  sectionSpacing: {
    marginVertical: 20,
  },
  roundColumn: {
    marginBottom: 0,
    alignItems: 'center',
    width: '100%',
  },
  semiFinalsColumn: {
    marginTop: 0,
    marginBottom: 0,
  },
  matchesContainer: {
    gap: 4,
  },
  quarterFinalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: 2,
  },
  semiFinalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  centerSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  finalTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  finalMatchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  matchWrapper: {
    alignItems: 'center',
  },
  matchContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 4,
    width: 160,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quarterFinalMatch: {
    width: 80,
    padding: 2,
  },
  quarterFinalTeam: {
    padding: 2,
  },
  quarterFinalFlag: {
    fontSize: 10,
    width: 16,
  },
  quarterFinalText: {
    fontSize: 8,
  },
  quarterFinalVs: {
    fontSize: 6,
    marginVertical: 0,
  },
  matchContainerDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  matchTeams: {
    width: '100%',
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  vsRowCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    width: '100%',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    height: 24,
  },
  teamContainerDark: {
    backgroundColor: '#1a1b1e',
    borderColor: '#3a3b3e',
  },
  tbdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
  },
  tbdContainerDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  tbdText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  winnerContainer: {
    backgroundColor: '#f0f9ff',
    borderColor: '#93c5fd',
  },
  winnerContainerDark: {
    backgroundColor: '#1e293b',
    borderColor: '#3b82f6',
  },
  teamCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#1f2937',
  },
  winnerText: {
    color: '#2563eb',
  },
  textDark: {
    color: '#f8fafc',
  },
  vsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  vsTextDark: {
    color: '#93c5fd',
  },
  matchDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 1,
  },
  connectorContainer: {
    width: 2,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connector: {
    position: 'relative',
  },
  vsFlag: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    opacity: 0.7,
  },
  flagText: {
    fontSize: 14,
    marginRight: 4,
    width: 20,
    textAlign: 'center',
  },
}); 