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
} from 'react-native-reanimated';
import { useTranslation } from '../src/hooks/useTranslation';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { language } = useTranslation();

  // Animated brain wave circles
  const wave1 = useSharedValue(1);
  const wave2 = useSharedValue(1);
  const wave3 = useSharedValue(1);
  const wave1Opacity = useSharedValue(0.4);
  const wave2Opacity = useSharedValue(0.3);
  const wave3Opacity = useSharedValue(0.2);

  useEffect(() => {
    wave1.value = withRepeat(
      withTiming(1.15, { duration: 4000 }),
      -1,
      true
    );
    wave2.value = withDelay(
      800,
      withRepeat(
        withTiming(1.2, { duration: 4500 }),
        -1,
        true
      )
    );
    wave3.value = withDelay(
      1600,
      withRepeat(
        withTiming(1.25, { duration: 5000 }),
        -1,
        true
      )
    );

    wave1Opacity.value = withRepeat(withTiming(0.6, { duration: 4000 }), -1, true);
    wave2Opacity.value = withRepeat(withTiming(0.5, { duration: 4500 }), -1, true);
    wave3Opacity.value = withRepeat(withTiming(0.4, { duration: 5000 }), -1, true);
  }, []);

  const animatedWave1 = useAnimatedStyle(() => ({
    transform: [{ scale: wave1.value }],
    opacity: wave1Opacity.value,
  }));

  const animatedWave2 = useAnimatedStyle(() => ({
    transform: [{ scale: wave2.value }],
    opacity: wave2Opacity.value,
  }));

  const animatedWave3 = useAnimatedStyle(() => ({
    transform: [{ scale: wave3.value }],
    opacity: wave3Opacity.value,
  }));

  const handleStart = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.primary, '#0A1628', colors.background.primary]}
        style={styles.gradient}
      >
        {/* Brain wave circles */}
        <Animated.View style={[styles.wave, styles.wave3, animatedWave3]} />
        <Animated.View style={[styles.wave, styles.wave2, animatedWave2]} />
        <Animated.View style={[styles.wave, styles.wave1, animatedWave1]} />

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Ionicons name="eye" size={50} color={colors.accent.glow} />
            </View>
            <View style={styles.hemisphereLeft} />
            <View style={styles.hemisphereRight} />
          </View>

          <Text style={styles.title}>GATEWAY</Text>
          <Text style={styles.subtitle}>EXPERIENCE</Text>
          
          <View style={styles.classificationBadge}>
            <Text style={styles.classificationText}>DECLASSIFIED</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {language === 'de' ? 'CIA Gateway Prozess' : 'CIA Gateway Process'}
            </Text>
            <Text style={styles.infoText}>
              {language === 'de' 
                ? 'Basierend auf dem 1983 freigegebenen CIA-Dokument zur Bewusstseinsforschung. Nutze Hemi-Sync Technologie zur Synchronisation deiner Gehirnhälften.'
                : 'Based on the 1983 declassified CIA document on consciousness research. Use Hemi-Sync technology to synchronize your brain hemispheres.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.accent.secondary, colors.accent.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {language === 'de' ? 'Gateway betreten' : 'Enter Gateway'}
              </Text>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Monroe Institute | 1983</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
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
  wave: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  wave1: {
    width: width * 0.55,
    height: width * 0.55,
  },
  wave2: {
    width: width * 0.75,
    height: width * 0.75,
  },
  wave3: {
    width: width * 0.95,
    height: width * 0.95,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent.secondary,
  },
  hemisphereLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 10,
    height: 2,
    backgroundColor: colors.accent.glow,
  },
  hemisphereRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 10,
    height: 2,
    backgroundColor: colors.accent.glow,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.accent.glow,
    letterSpacing: 8,
    marginTop: 4,
  },
  classificationBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.status.warning,
    borderRadius: 4,
  },
  classificationText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.status.warning,
    letterSpacing: 2,
  },
  infoBox: {
    backgroundColor: colors.overlay.light,
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border.accent,
    maxWidth: 320,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.glow,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    gap: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  versionText: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 4,
  },
});
