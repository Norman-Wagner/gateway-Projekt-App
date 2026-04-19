import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface BinauralPlayerProps {
  baseFrequency: number;
  beatFrequency: number;
  isPlaying: boolean;
  volume?: number;
  onAudioReady?: () => void;
}

export const BinauralPlayer: React.FC<BinauralPlayerProps> = ({
  baseFrequency,
  beatFrequency,
  isPlaying,
  volume = 0.3,
  onAudioReady,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    try {
      // Create AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.error('Web Audio API not supported');
        return;
      }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // Resume if suspended (due to autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Start silent
      gainNodeRef.current = gainNode;

      // Create channel merger for stereo
      const merger = audioContext.createChannelMerger(2);
      
      // Create left oscillator
      const leftOscillator = audioContext.createOscillator();
      leftOscillator.type = 'sine';
      leftOscillator.frequency.value = baseFrequency;
      const leftGain = audioContext.createGain();
      leftGain.gain.value = 1;
      leftOscillator.connect(leftGain);
      leftGain.connect(merger, 0, 0); // Left channel
      leftOscillatorRef.current = leftOscillator;

      // Create right oscillator
      const rightOscillator = audioContext.createOscillator();
      rightOscillator.type = 'sine';
      rightOscillator.frequency.value = baseFrequency + beatFrequency;
      const rightGain = audioContext.createGain();
      rightGain.gain.value = 1;
      rightOscillator.connect(rightGain);
      rightGain.connect(merger, 0, 1); // Right channel
      rightOscillatorRef.current = rightOscillator;

      // Connect merger to gain to destination
      merger.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start oscillators
      leftOscillator.start();
      rightOscillator.start();

      setIsInitialized(true);
      setNeedsInteraction(false);
      onAudioReady?.();
      console.log('Binaural audio initialized:', baseFrequency, 'Hz +', beatFrequency, 'Hz beat');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setNeedsInteraction(true);
    }
  }, [baseFrequency, beatFrequency, onAudioReady]);

  // Initialize audio when component mounts
  useEffect(() => {
    // Check if we need user interaction first
    if (Platform.OS === 'web') {
      // Try to init - if blocked, will show button
      initAudio().catch(() => setNeedsInteraction(true));
    }

    return () => {
      // Cleanup
      if (leftOscillatorRef.current) {
        try { leftOscillatorRef.current.stop(); } catch (e) {}
      }
      if (rightOscillatorRef.current) {
        try { rightOscillatorRef.current.stop(); } catch (e) {}
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  // Update frequencies when they change
  useEffect(() => {
    if (leftOscillatorRef.current && rightOscillatorRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      leftOscillatorRef.current.frequency.setValueAtTime(baseFrequency, currentTime);
      rightOscillatorRef.current.frequency.setValueAtTime(baseFrequency + beatFrequency, currentTime);
    }
  }, [baseFrequency, beatFrequency]);

  // Handle play/pause
  useEffect(() => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime;
    
    if (isPlaying) {
      // Resume context if needed
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      // Fade in
      gainNodeRef.current.gain.cancelScheduledValues(currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, currentTime + 0.5);
    } else {
      // Fade out
      gainNodeRef.current.gain.cancelScheduledValues(currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.3);
    }
  }, [isPlaying, volume]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current && isPlaying) {
      const currentTime = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(volume, currentTime);
    }
  }, [volume, isPlaying]);

  // Show activation button if needed
  if (needsInteraction && !isInitialized) {
    return (
      <View style={styles.activationContainer}>
        <TouchableOpacity 
          style={styles.activationButton}
          onPress={initAudio}
        >
          <Ionicons name="volume-high" size={24} color="#fff" />
          <Text style={styles.activationText}>Tap to enable audio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hidden component when audio is working
  return <View style={styles.hidden} />;
};

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
  },
  activationContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  activationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  activationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// Add type declarations for older browsers
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
