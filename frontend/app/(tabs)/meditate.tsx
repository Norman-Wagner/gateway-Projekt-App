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
import { colors, gradients } from '../../src/theme/colors';
import { focusLevels, focus10Meditation } from '../../src/data/gatewayData';

const { width } = Dimensions.get('window');

// Audio Context Manager
class BinauralAudioManager {
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  async initialize(baseFreq: number, beatFreq: number): Promise<boolean> {
    try {
      if (this.isInitialized) {
        this.updateFrequencies(baseFreq, beatFreq);
        return true;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.error('Web Audio API not supported');
        return false;
      }

      this.audioContext = new AudioContextClass();
      
      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0;
      
      // Create stereo merger
      const merger = this.audioContext.createChannelMerger(2);

      // Left oscillator (base frequency)
      this.leftOscillator = this.audioContext.createOscillator();
      this.leftOscillator.type = 'sine';
      this.leftOscillator.frequency.value = baseFreq;
      const leftGain = this.audioContext.createGain();
      leftGain.gain.value = 1;
      this.leftOscillator.connect(leftGain);
      leftGain.connect(merger, 0, 0);

      // Right oscillator (base + beat frequency)
      this.rightOscillator = this.audioContext.createOscillator();
      this.rightOscillator.type = 'sine';
      this.rightOscillator.frequency.value = baseFreq + beatFreq;
      const rightGain = this.audioContext.createGain();
      rightGain.gain.value = 1;
      this.rightOscillator.connect(rightGain);
      rightGain.connect(merger, 0, 1);

      // Connect to output
      merger.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start oscillators
      this.leftOscillator.start();
      this.rightOscillator.start();

      this.isInitialized = true;
      console.log(`Binaural audio initialized: ${baseFreq}Hz left, ${baseFreq + beatFreq}Hz right`);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  updateFrequencies(baseFreq: number, beatFreq: number) {
    if (this.leftOscillator && this.rightOscillator && this.audioContext) {
      const time = this.audioContext.currentTime;
      this.leftOscillator.frequency.setValueAtTime(baseFreq, time);
      this.rightOscillator.frequency.setValueAtTime(baseFreq + beatFreq, time);
    }
  }

  play(volume: number = 0.5) {
    if (this.gainNode && this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const time = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(time);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, time);
      this.gainNode.gain.linearRampToValueAtTime(volume, time + 0.5);
    }
  }

  pause() {
    if (this.gainNode && this.audioContext) {
      const time = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(time);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, time);
      this.gainNode.gain.linearRampToValueAtTime(0, time + 0.3);
    }
  }

  stop() {
    this.pause();
    if (this.leftOscillator) {
      try { this.leftOscillator.stop(); } catch (e) {}
      this.leftOscillator = null;
    }
    if (this.rightOscillator) {
      try { this.rightOscillator.stop(); } catch (e) {}
      this.rightOscillator = null;
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (e) {}
      this.audioContext = null;
    }
    this.gainNode = null;
    this.isInitialized = false;
  }
}

// Global audio manager instance
let audioManager: BinauralAudioManager | null = null;

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
  const [showStartModal, setShowStartModal] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<typeof focusLevels[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [audioReady, setAudioReady] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showMeditationText, setShowMeditationText] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get meditation phases for Focus 10
  const getMeditationPhases = () => {
    if (selectedLevel?.id === '10') {
      return focus10Meditation.phases;
    }
    return null;
  };

  const phases = getMeditationPhases();
  const currentPhase = phases ? phases[currentPhaseIndex] : null;

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2500 }),
          withTiming(1, { duration: 2500 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 2500 }),
          withTiming(0.2, { duration: 2500 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 500 });
      pulseOpacity.value = withTiming(0.3, { duration: 500 });
    }
  }, [isPlaying, isPaused]);

  // Timer effect
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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, timeRemaining]);

  // Phase progression effect
  useEffect(() => {
    if (isPlaying && !isPaused && phases) {
      let elapsed = 0;
      let phaseIdx = 0;
      
      // Calculate which phase we should be in based on session duration
      for (let i = 0; i < phases.length; i++) {
        if (sessionDuration < elapsed + phases[i].duration_seconds) {
          phaseIdx = i;
          break;
        }
        elapsed += phases[i].duration_seconds;
        if (i === phases.length - 1) phaseIdx = phases.length - 1;
      }
      
      if (phaseIdx !== currentPhaseIndex) {
        setCurrentPhaseIndex(phaseIdx);
      }
    }
  }, [sessionDuration, isPlaying, isPaused, phases]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioManager) {
        audioManager.stop();
        audioManager = null;
      }
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleSelectLevel = (level: typeof focusLevels[0]) => {
    if (level.isAdvanced && level.warning) {
      setPendingLevel(level);
      setShowWarningModal(true);
    } else {
      setPendingLevel(level);
      setShowStartModal(true);
    }
  };

  const handleStartSession = async () => {
    if (!pendingLevel) return;

    // Initialize audio with user interaction
    audioManager = new BinauralAudioManager();
    const success = await audioManager.initialize(
      pendingLevel.baseFrequency,
      pendingLevel.beatFrequency
    );

    if (success) {
      setAudioReady(true);
      audioManager.play(0.4);
    } else {
      Alert.alert(
        language === 'de' ? 'Audio-Fehler' : 'Audio Error',
        language === 'de' 
          ? 'Audio konnte nicht initialisiert werden. Bitte Kopfhörer verwenden.'
          : 'Could not initialize audio. Please use headphones.'
      );
    }

    setSelectedLevel(pendingLevel);
    setTimeRemaining(pendingLevel.durationMinutes * 60);
    setSessionDuration(0);
    setCurrentPhaseIndex(0);
    setIsPlaying(true);
    setIsPaused(false);
    setShowStartModal(false);
    setShowWarningModal(false);
    setPendingLevel(null);
  };

  const handlePause = () => {
    if (isPaused) {
      audioManager?.play(0.4);
    } else {
      audioManager?.pause();
    }
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    Alert.alert(
      language === 'de' ? 'Sitzung beenden?' : 'End Session?',
      '',
      [
        { text: language === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        {
          text: language === 'de' ? 'Beenden' : 'End',
          style: 'destructive',
          onPress: () => {
            audioManager?.stop();
            audioManager = null;
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
    audioManager?.stop();
    audioManager = null;
    setIsPlaying(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
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
    setCurrentPhaseIndex(0);
    setAudioReady(false);
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

  // ============= ACTIVE SESSION VIEW =============
  if (isPlaying && selectedLevel) {
    const leftFreq = selectedLevel.baseFrequency;
    const rightFreq = selectedLevel.baseFrequency + selectedLevel.beatFrequency;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={getLevelGradient(selectedLevel.id)}
          style={styles.sessionGradient}
        >
          <ScrollView 
            contentContainerStyle={styles.sessionContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Timer and Level */}
            <View style={styles.timerSection}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.levelText}>
                  {language === 'de' ? selectedLevel.name_de : selectedLevel.name}
                </Text>
              </View>
            </View>

            {/* Frequency Info */}
            <View style={styles.freqBox}>
              <View style={styles.freqRow}>
                <Text style={styles.freqLabel}>Binaural Beat:</Text>
                <Text style={styles.freqValueLarge}>{selectedLevel.beatFrequency} Hz</Text>
              </View>
              <View style={styles.freqDivider} />
              <View style={styles.freqRow}>
                <Text style={styles.freqLabel}>{language === 'de' ? 'L/R Ohr:' : 'L/R Ear:'}</Text>
                <Text style={styles.freqValue}>{leftFreq} / {rightFreq} Hz</Text>
              </View>
            </View>

            {/* Guided Meditation Text */}
            {currentPhase && showMeditationText && (
              <View style={styles.meditationBox}>
                <View style={styles.meditationHeader}>
                  <Ionicons name="text-outline" size={18} color={colors.text.secondary} />
                  <Text style={styles.meditationPhaseTitle}>
                    {language === 'de' ? currentPhase.title_de : currentPhase.title}
                  </Text>
                  <TouchableOpacity onPress={() => setShowMeditationText(false)}>
                    <Ionicons name="eye-off-outline" size={18} color={colors.text.muted} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.meditationScroll} nestedScrollEnabled>
                  <Text style={styles.meditationText}>
                    {language === 'de' ? currentPhase.script_de : currentPhase.script}
                  </Text>
                </ScrollView>
              </View>
            )}

            {!showMeditationText && currentPhase && (
              <TouchableOpacity 
                style={styles.showTextButton}
                onPress={() => setShowMeditationText(true)}
              >
                <Ionicons name="text-outline" size={18} color="#fff" />
                <Text style={styles.showTextButtonText}>
                  {language === 'de' ? 'Anleitung zeigen' : 'Show guidance'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlBtn} onPress={handlePause}>
                <Ionicons name={isPaused ? 'play' : 'pause'} size={28} color="#fff" />
                <Text style={styles.controlLabel}>
                  {isPaused ? (language === 'de' ? 'Weiter' : 'Resume') : (language === 'de' ? 'Pause' : 'Pause')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, styles.stopBtn]} onPress={handleStop}>
                <Ionicons name="stop" size={28} color="#fff" />
                <Text style={styles.controlLabel}>{language === 'de' ? 'Stopp' : 'Stop'}</Text>
              </TouchableOpacity>
            </View>

            {/* Headphone reminder */}
            <View style={styles.headphoneReminder}>
              <Ionicons name="headset-outline" size={16} color={colors.text.muted} />
              <Text style={styles.headphoneText}>
                {language === 'de' ? 'Stereo-Kopfhörer erforderlich' : 'Stereo headphones required'}
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ============= LEVEL SELECTION VIEW =============
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {language === 'de' ? 'Focus Level wählen' : 'Select Focus Level'}
        </Text>
        
        <View style={styles.headphoneWarning}>
          <Ionicons name="headset" size={20} color={colors.status.warning} />
          <Text style={styles.headphoneWarningText}>
            {language === 'de' 
              ? 'Stereo-Kopfhörer sind erforderlich für binaurale Beats!' 
              : 'Stereo headphones are required for binaural beats!'}
          </Text>
        </View>

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
              {level.isAdvanced && (
                <View style={styles.advancedBadge}>
                  <Ionicons name="warning" size={12} color={colors.status.warning} />
                  <Text style={styles.advancedText}>
                    {language === 'de' ? 'FORTGESCHRITTEN' : 'ADVANCED'}
                  </Text>
                </View>
              )}

              <View style={styles.levelHeader}>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>
                    {language === 'de' ? level.name_de : level.name}
                  </Text>
                  <Text style={styles.levelSubtitle}>
                    {language === 'de' ? level.subtitle_de : level.subtitle}
                  </Text>
                </View>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </View>
              
              <Text style={styles.levelDesc} numberOfLines={2}>
                {language === 'de' ? level.description_de : level.description}
              </Text>
              
              <View style={styles.levelMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.metaText}>{level.durationMinutes} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="radio-outline" size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.metaText}>{level.beatFrequency} Hz</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="headset-outline" size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.metaText}>{level.baseFrequency}/{level.baseFrequency + level.beatFrequency}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Start Confirmation Modal */}
      <Modal visible={showStartModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.startModal}>
            <Ionicons name="headset" size={48} color={colors.accent.glow} />
            <Text style={styles.startModalTitle}>
              {language === 'de' ? 'Bereit für die Sitzung?' : 'Ready for Session?'}
            </Text>
            <Text style={styles.startModalText}>
              {language === 'de' 
                ? `${pendingLevel?.name_de}\n\nStelle sicher, dass du Stereo-Kopfhörer trägst und einen ruhigen Ort hast.`
                : `${pendingLevel?.name}\n\nMake sure you are wearing stereo headphones and have a quiet space.`}
            </Text>
            <View style={styles.startModalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => { setShowStartModal(false); setPendingLevel(null); }}
              >
                <Text style={styles.cancelBtnText}>{language === 'de' ? 'Abbrechen' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.startBtn} onPress={handleStartSession}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.startBtnText}>{language === 'de' ? 'Starten' : 'Start'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Advanced Warning Modal */}
      <Modal visible={showWarningModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.warningModal}>
            <Ionicons name="warning" size={48} color={colors.status.warning} />
            <Text style={styles.warningTitle}>
              {language === 'de' ? 'Fortgeschrittenes Level' : 'Advanced Level'}
            </Text>
            <Text style={styles.warningText}>
              {language === 'de' ? pendingLevel?.warning_de : pendingLevel?.warning}
            </Text>
            <View style={styles.startModalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => { setShowWarningModal(false); setPendingLevel(null); }}
              >
                <Text style={styles.cancelBtnText}>{language === 'de' ? 'Abbrechen' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.startBtn, { backgroundColor: colors.status.warning }]} 
                onPress={() => { setShowWarningModal(false); setShowStartModal(true); }}
              >
                <Text style={styles.startBtnText}>{language === 'de' ? 'Verstanden' : 'I Understand'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Session Complete Modal */}
      <Modal visible={showCompleteModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.completeModal}>
            <Ionicons name="checkmark-circle" size={56} color={colors.status.success} />
            <Text style={styles.completeTitle}>
              {language === 'de' ? 'Sitzung abgeschlossen' : 'Session Complete'}
            </Text>
            <Text style={styles.completeDuration}>
              {Math.round(sessionDuration / 60)} {language === 'de' ? 'Minuten' : 'minutes'}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder={language === 'de' ? 'Beschreibe deine Erfahrung...' : 'Describe your experience...'}
              placeholderTextColor={colors.text.muted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSession}>
              <Text style={styles.saveBtnText}>{language === 'de' ? 'Im Tagebuch speichern' : 'Save to Journal'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={() => { resetSession(); setShowCompleteModal(false); }}>
              <Text style={styles.skipBtnText}>{language === 'de' ? 'Überspringen' : 'Skip'}</Text>
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
    marginBottom: 12,
    marginTop: 8,
  },
  headphoneWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.warning + '20',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  headphoneWarningText: {
    flex: 1,
    fontSize: 13,
    color: colors.status.warning,
  },
  levelCard: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },
  levelGradient: {
    padding: 18,
    position: 'relative',
  },
  advancedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  advancedText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.status.warning,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  levelSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 12,
  },
  levelMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  // Session styles
  sessionGradient: {
    flex: 1,
  },
  sessionContent: {
    padding: 20,
    alignItems: 'center',
  },
  timerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  levelText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  freqBox: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  freqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freqLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  freqValueLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  freqValue: {
    fontSize: 14,
    color: '#fff',
  },
  freqDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 10,
  },
  meditationBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 16,
    maxHeight: 200,
  },
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meditationPhaseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },
  meditationScroll: {
    maxHeight: 140,
  },
  meditationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  showTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    marginBottom: 16,
  },
  showTextButtonText: {
    fontSize: 13,
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  controlBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  stopBtn: {
    backgroundColor: 'rgba(139,61,61,0.5)',
  },
  controlLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  headphoneReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  headphoneText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 24,
  },
  startModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  startModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  startModalText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  startModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  warningModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  warningTitle: {
    fontSize: 20,
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
  completeModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 12,
  },
  completeDuration: {
    fontSize: 16,
    color: colors.accent.glow,
    marginTop: 4,
    marginBottom: 16,
  },
  notesInput: {
    width: '100%',
    height: 100,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  saveBtn: {
    width: '100%',
    backgroundColor: colors.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  skipBtn: {
    paddingVertical: 12,
  },
  skipBtnText: {
    fontSize: 14,
    color: colors.text.muted,
  },
});

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
