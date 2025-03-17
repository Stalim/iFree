import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { leagues, League } from '@/data/leagues';
import { ArrowLeft } from 'lucide-react-native';
import Tabla from '@/components/Tabla';
import { useTheme } from '@/context/ThemeContext';
import KnockoutPhase from '@/components/KnockoutPhase';

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      // Find league in local data
      const foundLeague = leagues.find(l => l.id === id) || null;
      setLeague(foundLeague);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  // Check if it's a Red Bull event or FMS Internacional
  const isKnockoutEvent = id?.startsWith('r') || id === 'fms_internacional';

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#93c5fd' : '#6366f1'} />
      </View>
    );
  }

  if (!league) {
    return (
      <View style={[styles.errorContainer, isDarkMode && styles.containerDark]}>
        <Text style={[styles.errorText, isDarkMode && styles.textDark]}>League not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: league.name,
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
      <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: league.logoUrl }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, isDarkMode && styles.titleDark]}>{league.name}</Text>
              {league.country && (
                <Text style={[styles.country, isDarkMode && styles.countryDark]}>{league.country}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {isKnockoutEvent ? (
            <KnockoutPhase 
              leagueId={id as string}
              isDarkMode={isDarkMode}
            />
          ) : (
            <Tabla 
              tablaName={league.id}
              isDarkMode={isDarkMode}
            />
          )}
        </View>
      </ScrollView>
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
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1f2937',
  },
  textDark: {
    color: '#f8fafc',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerDark: {
    backgroundColor: '#2a2b2e',
    borderBottomColor: '#3a3b3e',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 4,
  },
  titleDark: {
    color: '#f8fafc',
  },
  country: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  countryDark: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
}); 