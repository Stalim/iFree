import { Stack } from 'expo-router';

export default function LeaguesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        contentStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    />
  );
} 