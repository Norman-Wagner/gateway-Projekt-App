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
} from 'react-native-reanimated';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAppStore } from '../../src/store/appStore';
import { BinauralPlayer } from '../../src/components/BinauralPlayer';
import { colors, gradients } from '../../src/theme/colors';
import { focusLevels } from '../../src/data/gatewayData';

const { width } = Dimensions.get('window');

export default function MeditateScreen() {
  const { language } = useTranslation();
  const { createSession } = useAppStore();

  const [selectedLevel, setSelectedLevel] = useState<typeof focusLevels[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<typeof focusLevels[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [audioReady, setAudioReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
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

  const handleSelectLevel = (level: typeof focusLevels[0]) => {
    if (level.isAdvanced && level.warning) {
      setPendingLevel(level);
      setShowWarningModal(true);
    } else {
      startSession(level);
    }
  };

  const startSession = (level: typeof focusLevels[0]) => {
    setSelectedLevel(level);
    setTimeRemaining(level.durationMinutes * 60);
    setSessionDuration(0);
    setIsPlaying(true);
    setIsPaused(false);
    setShowWarningModal(false);
    setPendingLevel(null);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    Alert.alert(
      language === 'de' ? 'Sitzung beenden' : 'End Session',
      '',
      [
        { text: language === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        {
          text: language === 'de' ? 'Bestätigen' : 'Confirm',
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
    Alert.alert(language === 'de' ? 'Sitzung gespeichert!' : 'Session saved!');
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

  const getLevelGradient = (levelId: string): readonly [string, string, ...string[]] => {
    const gradientMap: Record<string, readonly [string, string, ...string[]]> = {
      '10': gradients.focus10 as readonly [string, string, ...string[]],
      '12': gradients.focus12 as readonly [string, string, ...string[]],
      '15': gradients.focus15 as readonly [string, string, ...string[]],
      '21': gradients.focus21 as readonly [string, string, ...string[]],
      '23': gradients.focus23 as readonly [string, string, ...string[]],
    };
    return gradientMap[levelId] || gradients.focus10 as readonly [string, string, ...string[]];
  };

  // Active Session View
  if (isPlaying && selectedLevel) {
    const leftFreq = selectedLevel.baseFrequency;
    const rightFreq = selectedLevel.baseFrequency + selectedLevel.beatFrequency;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={getLevelGradient(selectedLevel.id)}
          style={styles.sessionGradient}
        >
          <BinauralPlayer
            baseFrequency={selectedLevel.baseFrequency}
            beatFrequency={selectedLevel.beatFrequency}
            isPlaying={isPlaying && !isPaused}
            volume={0.5}
            onAudioReady={() => setAudioReady(true)}
          />

          {/* Animated Pulse Circle */}
          <View style={styles.pulseContainer}>
            <Animated.View style={[styles.pulseCircle, styles.pulseOuter, pulseStyle]} />
            <Animated.View style={[styles.pulseCircle, styles.pulseMiddle, pulseStyle]} />
            <View style={styles.centerCircle}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.levelText}>
                {language === 'de' ? selectedLevel.name_de : selectedLevel.name}
              </Text>
            </View>
          </View>

          {/* Frequency Details */}
          <View style={styles.frequencyDetails}>
            <View style={styles.frequencyRow}>
              <Text style={styles.frequencyLabel}>
                {language === 'de' ? 'Binaural Beat:' : 'Binaural Beat:'}
              </Text>
              <Text style={styles.frequencyValue}>
                {selectedLevel.beatFrequency} Hz
              </Text>
            </View>
            <View style={styles.frequencyRow}>
              <Text style={styles.frequencyLabel}>
                {language === 'de' ? 'Linkes Ohr:' : 'Left Ear:'}
              </Text>
              <Text style={styles.frequencySmall}>{leftFreq} Hz</Text>
            </View>
            <View style={styles.frequencyRow}>
              <Text style={styles.frequencyLabel}>
                {language === 'de' ? 'Rechtes Ohr:' : 'Right Ear:'}
              </Text>
              <Text style={styles.frequencySmall}>{rightFreq} Hz</Text>
            </View>
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
                {isPaused 
                  ? (language === 'de' ? 'Fortsetzen' : 'Resume')
                  : (language === 'de' ? 'Pause' : 'Pause')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStop}
            >
              <Ionicons name="stop" size={32} color="#fff" />
              <Text style={styles.controlText}>
                {language === 'de' ? 'Stopp' : 'Stop'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Level Selection View
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>
          {language === 'de' ? 'Focus Level wählen' : 'Select Focus Level'}
        </Text>

        {focusLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelCard}
            onPress={() => handleSelectLevel(level)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={getLevelGradient(level.id)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelGradient}
            >
              {/* Advanced Badge */}
              {level.isAdvanced && (
                <View style={styles.advancedBadge}>
                  <Ionicons name="warning" size={12} color={colors.status.warning} />
                  <Text style={styles.advancedBadgeText}>
                    {language === 'de' ? 'FORTGESCHRITTEN' : 'ADVANCED'}
                  </Text>
                </View>
              )}

              <View style={styles.levelHeader}>
                <View>
                  <Text style={styles.levelTitle}>
                    {language === 'de' ? level.name_de : level.name}
                  </Text>
                  <Text style={styles.levelSubtitle}>
                    {language === 'de' ? level.subtitle_de : level.subtitle}
                  </Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </View>
              
              <Text style={styles.levelDescription} numberOfLines={2}>
                {language === 'de' ? level.description_de : level.description}
              </Text>
              
              <View style={styles.levelMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>
                    {level.durationMinutes} {language === 'de' ? 'Min' : 'min'}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="radio-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>
                    {level.beatFrequency} Hz
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="headset-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>
                    {level.baseFrequency}/{level.baseFrequency + level.beatFrequency} Hz
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Advanced Level Warning Modal */}
      <Modal visible={showWarningModal} animationType="fade" transparent>
        <View style={styles.warningModalContainer}>
          <View style={styles.warningModalContent}>
            <Ionicons name="warning" size={48} color={colors.status.warning} />
            <Text style={styles.warningTitle}>
              {language === 'de' ? 'Fortgeschrittenes Level' : 'Advanced Level'}
            </Text>
            <Text style={styles.warningText}>
              {language === 'de' ? pendingLevel?.warning_de : pendingLevel?.warning}
            </Text>
            <View style={styles.warningButtons}>
              <TouchableOpacity
                style={styles.warningCancelButton}
                onPress={() => {
                  setShowWarningModal(false);
                  setPendingLevel(null);
                }}
              >
                <Text style={styles.warningCancelText}>
                  {language === 'de' ? 'Abbrechen' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.warningProceedButton}
                onPress={() => pendingLevel && startSession(pendingLevel)}
              >
                <Text style={styles.warningProceedText}>
                  {language === 'de' ? 'Fortfahren' : 'Proceed'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Session Complete Modal */}
      <Modal visible={showCompleteModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color={colors.accent.glow} />
            <Text style={styles.modalTitle}>
              {language === 'de' ? 'Sitzung abgeschlossen' : 'Session Complete'}
            </Text>
            <Text style={styles.modalDuration}>
              {Math.round(sessionDuration / 60)} {language === 'de' ? 'Minuten' : 'minutes'}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder={
                language === 'de' 
                  ? 'Beschreibe deine Erfahrung...' 
                  : 'Describe your experience...'
              }
              placeholderTextColor={colors.text.muted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSession}
            >
              <Text style={styles.saveButtonText}>
                {language === 'de' ? 'Speichern' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                resetSession();
                setShowCompleteModal(false);
              }}
            >
              <Text style={styles.skipButtonText}>
                {language === 'de' ? 'Überspringen' : 'Skip'}
              </Text>
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
    backgroundColor: colors.background.primary,
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
    color: colors.text.primary,
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
    position: 'relative',
  },
  advancedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  advancedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.status.warning,
    letterSpacing: 0.5,
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
    flexWrap: 'wrap',
    gap: 16,
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
  // Session View
  sessionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pulseContainer: {
    width: width * 0.75,
    height: width * 0.75,
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
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
  },
  levelText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  frequencyDetails: {
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  frequencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  frequencyLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  frequencyValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  frequencySmall: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
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
    backgroundColor: 'rgba(139,61,61,0.5)',
  },
  controlText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  // Warning Modal
  warningModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay.dark,
    padding: 24,
  },
  warningModalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  warningButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  warningCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
  },
  warningCancelText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  warningProceedButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.status.warning,
    alignItems: 'center',
  },
  warningProceedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Complete Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay.dark,
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
  },
  modalDuration: {
    fontSize: 16,
    color: colors.accent.glow,
    marginTop: 8,
  },
  notesInput: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
    marginTop: 24,
    textAlignVertical: 'top',
  },
  saveButton: {
    width: '100%',
    backgroundColor: colors.accent.primary,
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
    color: colors.text.muted,
  },
});
