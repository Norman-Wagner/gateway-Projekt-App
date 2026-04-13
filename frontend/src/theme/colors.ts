// Gateway App Color Theme - CIA Inspired
// Based on: Dark gray/black (#1E1E1E) + CIA Blue accent (#0A2F6C)

export const colors = {
  // Primary Background Colors
  background: {
    primary: '#0D0D12',      // Deep black with slight blue
    secondary: '#141420',    // Dark gray-blue
    tertiary: '#1A1A2E',     // Lighter background for cards
    card: '#12121C',         // Card background
  },
  
  // CIA Blue Accent Colors
  accent: {
    primary: '#0A2F6C',      // CIA Blue - main accent
    secondary: '#1E4D8C',    // Lighter CIA blue
    tertiary: '#2E5DA8',     // Even lighter for highlights
    glow: '#3D7DD4',         // Glow effect color
  },
  
  // Focus Level Colors (kept distinct for meditation states)
  focus: {
    level10: {
      primary: '#1E4D8C',    // Blue - Alpha waves
      secondary: '#0A2F6C',
      gradient: ['#1E4D8C', '#0A2F6C'],
    },
    level12: {
      primary: '#4B3B8C',    // Purple - Theta waves
      secondary: '#2E2660',
      gradient: ['#4B3B8C', '#2E2660'],
    },
    level15: {
      primary: '#6B2E8C',    // Deep purple - Delta waves
      secondary: '#4A1E6C',
      gradient: ['#6B2E8C', '#4A1E6C'],
    },
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0B8',
    tertiary: '#6A6A80',
    muted: '#4A4A60',
  },
  
  // Status Colors
  status: {
    success: '#2E8B57',
    warning: '#D4A03D',
    error: '#8B3D3D',
    info: '#3D7DD4',
  },
  
  // Mood Colors
  mood: {
    peaceful: '#2E8B57',
    energized: '#D4A03D',
    confused: '#6A6A80',
    enlightened: '#D4C43D',
    tired: '#4A5568',
  },
  
  // Border Colors
  border: {
    primary: '#1E1E30',
    secondary: '#2A2A40',
    accent: '#0A2F6C',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(10, 47, 108, 0.1)',   // CIA blue overlay
    medium: 'rgba(10, 47, 108, 0.3)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Energy Balloon (REBAL) Colors
  rebal: {
    inner: '#3D7DD4',
    outer: '#0A2F6C',
    glow: 'rgba(61, 125, 212, 0.3)',
  },
};

// Gradient presets
export const gradients = {
  background: ['#0D0D12', '#141420', '#0D0D12'],
  card: ['#141420', '#1A1A2E'],
  button: ['#0A2F6C', '#1E4D8C'],
  focus10: ['#1E4D8C', '#0A2F6C'],
  focus12: ['#4B3B8C', '#2E2660'],
  focus15: ['#6B2E8C', '#4A1E6C'],
  header: ['#0D0D12', 'transparent'],
};
