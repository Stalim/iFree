import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Player } from '@/types';

interface PlayerTableProps {
  players: Player[];
}

export default function PlayerTable({ players }: PlayerTableProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.playerCell]}>Player</Text>
        <Text style={styles.headerCell}>Battles</Text>
        <Text style={styles.headerCell}>Wins</Text>
        <Text style={styles.headerCell}>Losses</Text>
        <Text style={styles.headerCell}>Points</Text>
      </View>
      {players.map((player) => (
        <View key={player.id} style={styles.row}>
          <View style={[styles.cell, styles.playerCell]}>
            <Image source={{ uri: player.imageUrl }} style={styles.avatar} />
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
          <Text style={styles.cell}>{player.totalBattles}</Text>
          <Text style={styles.cell}>{player.wins}</Text>
          <Text style={styles.cell}>{player.losses}</Text>
          <Text style={styles.cell}>{player.points}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerCell: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  cell: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
  },
  playerCell: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  playerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1f2937',
  },
});