import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from '../src/hooks/useTranslation';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Animated circles
  const circle1Scale = useSharedValue(1);
  const circle2Scale = useSharedValue(1);
  const circle3Scale = useSharedValue(1);
  const circle1Opacity = useSharedValue(0.3);
  const circle2Opacity = useSharedValue(0.2);
  const circle3Opacity = useSharedValue(0.1);

  useEffect(() => {
    // Pulsing animations
    circle1Scale.value = withRepeat(
      withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    circle2Scale.value = withDelay(
      500,
      withRepeat(
        withTiming(1.3, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    circle3Scale.value = withDelay(
      1000,
      withRepeat(
        withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    circle1Opacity.value = withRepeat(
      withTiming(0.5, { duration: 3000 }),
      -1,
      true
    );
    circle2Opacity.value = withRepeat(
      withTiming(0.4, { duration: 3500 }),
      -1,
      true
    );
    circle3Opacity.value = withRepeat(
      withTiming(0.3, { duration: 4000 }),
      -1,
      true
    );
  }, []);

  const animatedCircle1 = useAnimatedStyle(() => ({
    transform: [{ scale: circle1Scale.value }],
    opacity: circle1Opacity.value,
  }));

  const animatedCircle2 = useAnimatedStyle(() => ({
    transform: [{ scale: circle2Scale.value }],
    opacity: circle2Opacity.value,
  }));

  const animatedCircle3 = useAnimatedStyle(() => ({
    transform: [{ scale: circle3Scale.value }],
    opacity: circle3Opacity.value,
  }));

  const handleStart = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a1a', '#1a1a3a', '#0a0a1a']}
        style={styles.gradient}
      >
        {/* Animated background circles */}
        <Animated.View style={[styles.circle, styles.circle3, animatedCircle3]} />
        <Animated.View style={[styles.circle, styles.circle2, animatedCircle2]} />
        <Animated.View style={[styles.circle, styles.circle1, animatedCircle1]} />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="eye-outline" size={80} color="#7B68EE" />
          </View>

          <Text style={styles.title}>GATEWAY</Text>
          <Text style={styles.subtitle}>{t.home.subtitle}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {t.profile.aboutText}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#7B68EE', '#9932CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Enter Gateway</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>v1.0.0 | Declassified</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#7B68EE',
  },
  circle1: {
    width: width * 0.6,
    height: width * 0.6,
  },
  circle2: {
    width: width * 0.8,
    height: width * 0.8,
  },
  circle3: {
    width: width,
    height: width,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(123, 104, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B8B9E',
    textAlign: 'center',
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: 'rgba(123, 104, 238, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.2)',
  },
  infoText: {
    fontSize: 14,
    color: '#a0a0b0',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#5a5a6e',
  },
});
