import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../src/store/appStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

export default function HomeScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const {
    sessions,
    statistics,
    isLoading,
    fetchSessions,
    fetchStatistics,
  } = useAppStore();

  useEffect(() => {
    fetchSessions();
    fetchStatistics();
  }, []);

  const handleRefresh = () => {
    fetchSessions();
    fetchStatistics();
  };

  const focusLevelColors: Record<string, string[]> = {
    '10': ['#4A90D9', '#357ABD'],
    '12': ['#7B68EE', '#6A5ACD'],
    '15': ['#9932CC', '#8B008B'],
  };

  const getFocusLevelTitle = (level: string) => {
    const titles: Record<string, string> = {
      '10': t.meditate.focus10.title,
      '12': t.meditate.focus12.title,
      '15': t.meditate.focus15.title,
    };
    return titles[level] || `Focus ${level}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#7B68EE"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="eye-outline" size={32} color="#7B68EE" />
          </View>
          <Text style={styles.welcomeText}>{t.home.welcome}</Text>
          <Text style={styles.subtitle}>{t.home.subtitle}</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="pulse-outline" size={24} color="#4A90D9" />
            <Text style={styles.statNumber}>{statistics?.total_sessions || 0}</Text>
            <Text style={styles.statLabel}>{t.home.totalSessions}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#7B68EE" />
            <Text style={styles.statNumber}>{statistics?.total_minutes || 0}</Text>
            <Text style={styles.statLabel}>{t.home.totalMinutes}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{statistics?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>{t.home.currentStreak}</Text>
          </View>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.home.quickStart}</Text>
          <View style={styles.quickStartGrid}>
            {['10', '12', '15'].map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.quickStartCard}
                onPress={() => router.push('/(tabs)/meditate')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={focusLevelColors[level]}
                  style={styles.quickStartGradient}
                >
                  <Text style={styles.quickStartLevel}>{getFocusLevelTitle(level)}</Text>
                  <Ionicons name="play-circle-outline" size={28} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.home.recentSessions}</Text>
          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="moon-outline" size={48} color="#3a3a5a" />
              <Text style={styles.emptyText}>{t.home.noSessions}</Text>
            </View>
          ) : (
            sessions.slice(0, 5).map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View
                  style={[
                    styles.sessionIndicator,
                    { backgroundColor: focusLevelColors[session.focus_level]?.[0] || '#7B68EE' },
                  ]}
                />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>
                    {getFocusLevelTitle(session.focus_level)}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {format(
                      new Date(session.created_at),
                      'PPp',
                      { locale: language === 'de' ? de : enUS }
                    )}
                  </Text>
                </View>
                <Text style={styles.sessionDuration}>
                  {Math.round(session.duration_seconds / 60)} {t.meditate.minutes}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(123, 104, 238, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8B8B9E',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#6a6a8a',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  quickStartGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStartCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickStartGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  quickStartLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#12122a',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6a6a8a',
    marginTop: 12,
    textAlign: 'center',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sessionIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sessionDate: {
    fontSize: 12,
    color: '#6a6a8a',
    marginTop: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: '#7B68EE',
    fontWeight: '500',
  },
});
