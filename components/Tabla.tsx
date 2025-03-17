import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import PlayerProfile, { PlayerInfo } from './PlayerProfile';
import { API_ENDPOINTS, API_CONFIG } from '@/config';
import { getPlayerById } from '@/services/playerService';

interface StandingEntry {
  position: number;
  name: string;
  points: number;
  matches: number;
}

interface TablaProps {
  tablaName: string;
  isDarkMode: boolean;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Tabla({ tablaName, isDarkMode }: TablaProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo | null>(null);
  const [data, setData] = useState<StandingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTablaData = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching tabla data from:', `${API_ENDPOINTS.TABLA}/${tablaName}`);
      console.log('Attempt:', retryCount + 1);

      const response = await fetchWithTimeout(`${API_ENDPOINTS.TABLA}/${tablaName}`);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }

      const tablaData = await response.json();
      console.log('Fetched tabla data:', tablaData);

      // Convert the entries to the StandingEntry format
      const entries: StandingEntry[] = tablaData.entries.map((entry: any) => ({
        position: entry.position,
        name: entry.name,
        matches: entry.matches,
        points: entry.points
      }));

      setData(entries);
    } catch (err) {
      console.error('Error fetching tabla data:', err);

      if (retryCount < API_CONFIG.RETRY_ATTEMPTS - 1) {
        console.log(`Retrying in ${API_CONFIG.RETRY_DELAY_MS}ms...`);
        await delay(API_CONFIG.RETRY_DELAY_MS);
        return fetchTablaData(retryCount + 1);
      }

      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTablaData();
  }, [tablaName]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#6366f1'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDarkMode && styles.textDark]}>
            Error: {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, isDarkMode && styles.retryButtonDark]}
            onPress={() => fetchTablaData(0)}
          >
            <Text style={[styles.retryButtonText, isDarkMode && styles.textDark]}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <Text style={[styles.noDataText, isDarkMode && styles.textDark]}>
          No se encontraron datos de la tabla
        </Text>
      </View>
    );
  }

  const handlePlayerPress = async (playerName: string) => {
    try {
      setIsLoading(true);
      
      // Extract player ID from name (assuming format like "Aczino" or "Chuty")
      // Convert to lowercase and remove any parentheses content
      let playerId = playerName.toLowerCase().split('(')[0].trim();
      
      // Map common player names to their IDs
      const playerIdMap: Record<string, string> = {
        'aczino': 'aczino',
        'mauricio': 'aczino',
        'chuty': 'chuty',
        'sergio': 'chuty',
        'dtoke': 'dtoke',
        'nicolás': 'dtoke',
        'nicolas': 'dtoke',
        'skone': 'skone',
        'josé': 'skone',
        'jose': 'skone',
        'wos': 'wos',
        'valentín': 'wos',
        'valentin': 'wos',
        'trueno': 'trueno',
        'mateo': 'trueno',
        'bnet': 'bnet',
        'javier': 'bnet',
        'rapder': 'rapder',
        'eder': 'rapder',
        'gazir': 'gazir',
        'gabriel': 'gazir'
      };
      
      // Check if we have a mapping for this player name
      if (playerIdMap[playerId]) {
        playerId = playerIdMap[playerId];
      }
      
      console.log('Player name:', playerName);
      console.log('Extracted player ID:', playerId);
      
      // First check the debug endpoint to see what's available
      try {
        console.log('Checking debug endpoint for player ID:', playerId);
        const debugResponse = await fetch(`${API_ENDPOINTS.PLAYERS}/debug/${playerId}`);
        const debugData = await debugResponse.json();
        
        if (debugResponse.ok) {
          console.log('Debug endpoint found player:', debugData.player.name);
          console.log('Now trying regular endpoint');
        } else {
          console.log('Debug endpoint did not find player. Available IDs:', debugData.availableIds);
          
          // If the player wasn't found but we have available IDs, try to find a close match
          if (debugData.availableIds && debugData.availableIds.length > 0) {
            const closeMatch = debugData.availableIds.find((id: string) => 
              id.includes(playerId) || playerId.includes(id)
            );
            
            if (closeMatch) {
              console.log('Found a close match:', closeMatch);
              playerId = closeMatch;
            }
          }
        }
      } catch (debugError) {
        console.error('Error checking debug endpoint:', debugError);
      }
      
      // Get the player from our API
      try {
        console.log('Attempting to fetch player with ID:', playerId);
        const playerInfo = await getPlayerById(playerId);
        console.log('Player found in API:', playerInfo.name);
        setSelectedPlayer(playerInfo);
      } catch (apiError: any) {
        console.error('Player not found in API:', apiError);
        console.error('API Error details:', apiError.response?.data || 'No response data');
        console.error('API Error status:', apiError.response?.status || 'No status code');
        
        // Try a direct API call as a fallback
        try {
          console.log('Trying direct API call as fallback');
          const response = await fetch(`${API_ENDPOINTS.PLAYERS}/${playerId}`);
          if (response.ok) {
            const playerData = await response.json();
            console.log('Player found via direct API call:', playerData.name);
            setSelectedPlayer(playerData);
          } else {
            console.error('Direct API call also failed:', response.status);
            setSelectedPlayer(null);
          }
        } catch (directError) {
          console.error('Direct API call error:', directError);
          setSelectedPlayer(null);
        }
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      setSelectedPlayer(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.tableWrapper, isDarkMode && styles.tableWrapperDark]}>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Header */}
        <View style={[
          styles.row, 
          styles.headerRow, 
          { borderBottomColor: isDarkMode ? '#2d2d2d' : '#e2e8f0' },
          isDarkMode && styles.headerRowDark
        ]}>
          <View style={styles.positionColumn}>
            <Text style={[styles.headerCell, isDarkMode && styles.headerCellDark]}>#</Text>
          </View>
          <View style={styles.nameColumn}>
            <Text style={[styles.headerCell, isDarkMode && styles.headerCellDark, styles.nameHeaderCell]}>MC</Text>
          </View>
          <View style={styles.statsColumn}>
            <Text style={[styles.headerCell, isDarkMode && styles.headerCellDark]}>PJ</Text>
          </View>
          <View style={styles.statsColumn}>
            <Text style={[styles.headerCell, isDarkMode && styles.headerCellDark]}>Pts</Text>
          </View>
        </View>

        {/* Rows */}
        {data.map((entry, index) => (
          <Pressable 
            key={index}
            onPress={() => handlePlayerPress(entry.name)}
            style={({ pressed }) => [
              styles.row,
              styles.dataRow,
              { borderBottomColor: isDarkMode ? '#2d2d2d' : '#e2e8f0' },
              isDarkMode && styles.dataRowDark,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
              isDarkMode && (index % 2 === 0 ? styles.evenRowDark : styles.oddRowDark),
              index === data.length - 1 && styles.lastRow,
              pressed && styles.pressedRow,
              pressed && isDarkMode && styles.pressedRowDark,
            ]}
          >
            <View style={styles.positionColumn}>
              <Text style={[styles.positionText, isDarkMode && styles.textDark]}>
                {entry.position}
              </Text>
            </View>
            <View style={styles.nameColumn}>
              <Text style={[styles.nameText, isDarkMode && styles.textDark]} numberOfLines={1}>
                {entry.name}
              </Text>
            </View>
            <View style={styles.statsColumn}>
              <Text style={[styles.statsText, isDarkMode && styles.textDark]}>
                {entry.matches}
              </Text>
            </View>
            <View style={styles.statsColumn}>
              <Text style={[styles.statsText, isDarkMode && styles.textDark]}>
                {entry.points}
              </Text>
            </View>
          </Pressable>
        ))}

        {/* Legend */}
        <View style={[styles.legend, isDarkMode && styles.legendDark]}>
          <Text style={[styles.legendTitle, isDarkMode && styles.textDark]}>Leyenda:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Text style={[styles.legendText, isDarkMode && styles.textDark]}>Pos - Posición</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendText, isDarkMode && styles.textDark]}>MC - MC Freestyler</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendText, isDarkMode && styles.textDark]}>PJ - Partidas Jugadas</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendText, isDarkMode && styles.textDark]}>Pts - Puntos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Player Profile Modal */}
      <Modal
        visible={selectedPlayer !== null}
        animationType="slide"
        onRequestClose={() => setSelectedPlayer(null)}
      >
        <SafeAreaView style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
          <View style={styles.modalHeader}>
            <Pressable 
              onPress={() => setSelectedPlayer(null)}
              style={[styles.closeButton, isDarkMode && styles.closeButtonDark]}
            >
              <Text style={[styles.closeButtonText, isDarkMode && styles.textDark]}>✕</Text>
            </Pressable>
          </View>
          {selectedPlayer && (
            <PlayerProfile player={selectedPlayer} isDarkMode={isDarkMode} />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tableWrapper: {
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tableWrapperDark: {
    borderColor: '#2d2d2d',
    backgroundColor: '#1e1e1e',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderBottomWidth: 2,
  },
  headerRowDark: {
    backgroundColor: '#1e1e1e',
  },
  dataRow: {
    backgroundColor: '#ffffff',
  },
  dataRowDark: {
    backgroundColor: '#1e1e1e',
  },
  headerCell: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
  },
  headerCellDark: {
    color: '#ffffff',
  },
  nameHeaderCell: {
    textAlign: 'left',
    paddingLeft: 8,
  },
  positionColumn: {
    width: 50,
    alignItems: 'center',
  },
  nameColumn: {
    flex: 1.5,
    paddingHorizontal: 8,
  },
  statsColumn: {
    width: 55,
    alignItems: 'center',
  },
  positionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1f2937',
  },
  nameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1f2937',
  },
  statsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  textDark: {
    color: '#ffffff',
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#4b5563',
    fontFamily: 'Inter-Regular',
  },
  legend: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  legendDark: {
    backgroundColor: '#262626',
    borderTopColor: '#2d2d2d',
  },
  legendTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  legendItem: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: '50%',
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f8fafc',
  },
  evenRowDark: {
    backgroundColor: '#262626',
  },
  oddRowDark: {
    backgroundColor: '#1e1e1e',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  pressedRow: {
    backgroundColor: '#f3f4f6',
  },
  pressedRowDark: {
    backgroundColor: '#2d2d2d',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContainerDark: {
    backgroundColor: '#121212',
  },
  modalHeader: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  closeButtonDark: {
    backgroundColor: '#2d2d2d',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  retryButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  retryButtonDark: {
    backgroundColor: '#2a2b2e',
    borderColor: '#3a3b3e',
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
}); 