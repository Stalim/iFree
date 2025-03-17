import { Tabs } from 'expo-router';
import { Swords, Crown, Bookmark, Settings, Calendar1Icon, CalendarX2Icon, CalendarCheck2Icon, Calendar, Mic2 } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1b1e' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#3a3b3e' : '#e5e5e5',
        },
        tabBarActiveTintColor: isDarkMode ? '#93c5fd' : '#0f2167',
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280',
        headerStyle: {
          backgroundColor: isDarkMode ? '#1a1b1e' : '#0f2167',
          height: 100,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 22,
          color: '#ffffff',
        },
        headerTitle: () => (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: 12,
            paddingTop: 8,
            paddingHorizontal: 4,
            height: 60
          }}>
            <Mic2 size={28} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={{ 
              color: '#f8fafc', 
              fontSize: 28, 
              fontFamily: 'System',
              fontWeight: '900',
              letterSpacing: 1.5,
              textShadowColor: 'rgba(255, 255, 255, 0.25)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}>
              Free
            </Text>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ligas"
        options={{
          title: 'Ligas',
          tabBarIcon: ({ color, size }) => <Crown size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="points"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}