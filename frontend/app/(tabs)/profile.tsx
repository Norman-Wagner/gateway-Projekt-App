import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAppStore } from '../../src/store/appStore';

export default function ProfileScreen() {
  const { t, language, setLanguage } = useTranslation();
  const { statistics } = useAppStore();

  const stats = [
    {
      icon: 'pulse-outline',
      label: t.home.totalSessions,
      value: statistics?.total_sessions || 0,
      color: '#4A90D9',
    },
    {
      icon: 'time-outline',
      label: t.home.totalMinutes,
      value: statistics?.total_minutes || 0,
      color: '#7B68EE',
    },
    {
      icon: 'flame-outline',
      label: t.home.currentStreak,
      value: `${statistics?.streak_days || 0} ${t.home.days}`,
      color: '#FF6B6B',
    },
    {
      icon: 'book-outline',
      label: t.journal.title,
      value: statistics?.journal_entries || 0,
      color: '#4CAF50',
    },
  ];

  const focusStats = [
    {
      level: 'Focus 10',
      sessions: statistics?.focus_levels?.['10'] || 0,
      color: '#4A90D9',
    },
    {
      level: 'Focus 12',
      sessions: statistics?.focus_levels?.['12'] || 0,
      color: '#7B68EE',
    },
    {
      level: 'Focus 15',
      sessions: statistics?.focus_levels?.['15'] || 0,
      color: '#9932CC',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#7B68EE" />
          </View>
          <Text style={styles.title}>{t.profile.title}</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.profile.statistics}</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Focus Level Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Level Progress</Text>
          <View style={styles.focusStats}>
            {focusStats.map((item, index) => (
              <View key={index} style={styles.focusStatRow}>
                <View style={styles.focusLevelInfo}>
                  <View
                    style={[
                      styles.focusIndicator,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.focusLevelText}>{item.level}</Text>
                </View>
                <Text style={styles.focusSessionCount}>
                  {item.sessions} {t.home.totalSessions.toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.profile.settings}</Text>

          {/* Language Setting */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Ionicons name="language-outline" size={24} color="#7B68EE" />
              <Text style={styles.settingTitle}>{t.profile.language}</Text>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'en' && styles.languageButtonActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language === 'en' && styles.languageButtonTextActive,
                  ]}
                >
                  {t.profile.english}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'de' && styles.languageButtonActive,
                ]}
                onPress={() => setLanguage('de')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language === 'de' && styles.languageButtonTextActive,
                  ]}
                >
                  {t.profile.german}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.profile.about}</Text>
          <View style={styles.aboutCard}>
            <Ionicons name="eye-outline" size={40} color="#7B68EE" />
            <Text style={styles.aboutText}>{t.profile.aboutText}</Text>
            <Text style={styles.versionText}>{t.profile.version} 1.0.0</Text>
          </View>
        </View>

        {/* CIA Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={20} color="#6a6a8a" />
          <Text style={styles.disclaimerText}>
            {language === 'de'
              ? 'Basierend auf dem 1983 freigegebenen CIA-Dokument "Analysis and Assessment of Gateway Process"'
              : 'Based on the 1983 declassified CIA document "Analysis and Assessment of Gateway Process"'}
          </Text>
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
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(123, 104, 238, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6a6a8a',
    marginTop: 4,
    textAlign: 'center',
  },
  focusStats: {
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  focusStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3a',
  },
  focusLevelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  focusLevelText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  focusSessionCount: {
    fontSize: 14,
    color: '#6a6a8a',
  },
  settingCard: {
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a3a',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#7B68EE',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#6a6a8a',
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  aboutCard: {
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  aboutText: {
    fontSize: 14,
    color: '#a0a0b0',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#6a6a8a',
    marginTop: 16,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#6a6a8a',
    lineHeight: 18,
  },
});
