import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAppStore } from '../../src/store/appStore';
import { BinauralPlayer } from '../../src/components/BinauralPlayer';

const { width } = Dimensions.get('window');

interface FocusLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  beatFrequency: number;
  baseFrequency: number;
  durationMinutes: number;
  colors: string[];
}

export default function MeditateScreen() {
  const { t } = useTranslation();
  const { createSession } = useAppStore();

  const focusLevels: FocusLevel[] = [
    {
      id: '10',
      title: t.meditate.focus10.title,
      subtitle: t.meditate.focus10.subtitle,
      description: t.meditate.focus10.description,
      beatFrequency: 10,
      baseFrequency: 200,
      durationMinutes: 15,
      colors: ['#4A90D9', '#357ABD'],
    },
    {
      id: '12',
      title: t.meditate.focus12.title,
      subtitle: t.meditate.focus12.subtitle,
      description: t.meditate.focus12.description,
      beatFrequency: 7,
      baseFrequency: 200,
      durationMinutes: 20,
      colors: ['#7B68EE', '#6A5ACD'],
    },
    {
      id: '15',
      title: t.meditate.focus15.title,
      subtitle: t.meditate.focus15.subtitle,
      description: t.meditate.focus15.description,
      beatFrequency: 4,
      baseFrequency: 200,
      durationMinutes: 25,
      colors: ['#9932CC', '#8B008B'],
    },
  ];

  const [selectedLevel, setSelectedLevel] = useState<FocusLevel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(0.3, { duration: 2000 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 500 });
      pulseOpacity.value = withTiming(0.3, { duration: 500 });
    }
  }, [isPlaying, isPaused]);

  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, timeRemaining]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleStartSession = (level: FocusLevel) => {
    setSelectedLevel(level);
    setTimeRemaining(level.durationMinutes * 60);
    setSessionDuration(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    Alert.alert(
      t.meditate.stop,
      '',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          onPress: () => {
            setIsPlaying(false);
            setIsPaused(false);
            if (sessionDuration > 60) {
              setShowCompleteModal(true);
            } else {
              resetSession();
            }
          },
        },
      ]
    );
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowCompleteModal(true);
  };

  const handleSaveSession = async () => {
    if (selectedLevel) {
      await createSession({
        focus_level: selectedLevel.id,
        duration_seconds: sessionDuration,
        completed: timeRemaining === 0,
        notes: notes || undefined,
      });
    }
    resetSession();
    setShowCompleteModal(false);
    Alert.alert(t.meditate.sessionSaved);
  };

  const resetSession = () => {
    setSelectedLevel(null);
    setTimeRemaining(0);
    setSessionDuration(0);
    setNotes('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isPlaying && selectedLevel) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={selectedLevel.colors}
          style={styles.sessionGradient}
        >
          {/* Binaural Player (hidden) */}
          <BinauralPlayer
            baseFrequency={selectedLevel.baseFrequency}
            beatFrequency={selectedLevel.beatFrequency}
            isPlaying={isPlaying && !isPaused}
            volume={0.3}
          />

          {/* Animated Pulse Circle */}
          <View style={styles.pulseContainer}>
            <Animated.View style={[styles.pulseCircle, styles.pulseOuter, pulseStyle]} />
            <Animated.View style={[styles.pulseCircle, styles.pulseMiddle, pulseStyle]} />
            <View style={styles.centerCircle}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.levelText}>{selectedLevel.title}</Text>
            </View>
          </View>

          {/* Frequency Info */}
          <View style={styles.frequencyInfo}>
            <Text style={styles.frequencyLabel}>{t.meditate.frequency}</Text>
            <Text style={styles.frequencyValue}>
              {selectedLevel.beatFrequency} {t.meditate.hz}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePause}
            >
              <Ionicons
                name={isPaused ? 'play' : 'pause'}
                size={32}
                color="#fff"
              />
              <Text style={styles.controlText}>
                {isPaused ? t.meditate.resume : t.meditate.pause}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStop}
            >
              <Ionicons name="stop" size={32} color="#fff" />
              <Text style={styles.controlText}>{t.meditate.stop}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t.meditate.selectLevel}</Text>

        {focusLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelCard}
            onPress={() => handleStartSession(level)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={level.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelGradient}
            >
              <View style={styles.levelHeader}>
                <View>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelSubtitle}>{level.subtitle}</Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </View>
              <Text style={styles.levelDescription}>{level.description}</Text>
              <View style={styles.levelMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>
                    {level.durationMinutes} {t.meditate.minutes}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="radio-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>
                    {level.beatFrequency} {t.meditate.hz}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Session Complete Modal */}
      <Modal
        visible={showCompleteModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#7B68EE" />
            <Text style={styles.modalTitle}>{t.meditate.sessionComplete}</Text>
            <Text style={styles.modalDuration}>
              {Math.round(sessionDuration / 60)} {t.meditate.minutes}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder={t.meditate.notesPlaceholder}
              placeholderTextColor="#6a6a8a"
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSession}
            >
              <Text style={styles.saveButtonText}>{t.meditate.saveNotes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                resetSession();
                setShowCompleteModal(false);
              }}
            >
              <Text style={styles.skipButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    marginTop: 16,
  },
  levelCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelGradient: {
    padding: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  levelSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  levelMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  // Session View Styles
  sessionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pulseContainer: {
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pulseOuter: {
    width: '100%',
    height: '100%',
  },
  pulseMiddle: {
    width: '75%',
    height: '75%',
  },
  centerCircle: {
    width: '50%',
    height: '50%',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  levelText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  frequencyInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  frequencyLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  frequencyValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 48,
    gap: 24,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  stopButton: {
    backgroundColor: 'rgba(255,100,100,0.3)',
  },
  controlText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#12122a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
  },
  modalDuration: {
    fontSize: 16,
    color: '#7B68EE',
    marginTop: 8,
  },
  notesInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#1a1a3a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginTop: 24,
    textAlignVertical: 'top',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#7B68EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6a6a8a',
  },
});
