// Gateway App Color Theme - CIA Inspired (Updated)
// Based on: Very dark background (#0A0F1A) + CIA Blue accent (#0A2F6C)

export const colors = {
  // Primary Background Colors - Darker "classified documents" look
  background: {
    primary: '#0A0F1A',      // Very dark, almost black with blue tint
    secondary: '#0E1420',    // Slightly lighter for contrast
    tertiary: '#141C2A',     // Card backgrounds
    card: '#0D1218',         // Deep card background
  },
  
  // CIA Blue Accent Colors
  accent: {
    primary: '#0A2F6C',      // CIA Blue - main accent
    secondary: '#1E4D8C',    // Lighter CIA blue
    tertiary: '#2E5DA8',     // Even lighter for highlights
    glow: '#3D7DD4',         // Glow effect color
  },
  
  // Focus Level Colors (extended for more levels)
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
    level21: {
      primary: '#8C2E6B',    // Magenta - Bridge state
      secondary: '#6C1E4A',
      gradient: ['#8C2E6B', '#6C1E4A'],
    },
    level23: {
      primary: '#8C3D2E',    // Deep red/orange - OBE state
      secondary: '#6C2E1E',
      gradient: ['#8C3D2E', '#6C2E1E'],
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
    primary: '#1A2030',
    secondary: '#2A3040',
    accent: '#0A2F6C',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(10, 47, 108, 0.1)',   // CIA blue overlay
    medium: 'rgba(10, 47, 108, 0.3)',
    dark: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Energy Balloon (REBAL) Colors
  rebal: {
    inner: '#3D7DD4',
    outer: '#0A2F6C',
    glow: 'rgba(61, 125, 212, 0.3)',
  },
  
  // Warning/Advanced level indicator
  advanced: {
    warning: '#D4A03D',
    danger: '#8B3D3D',
  },
};

// Gradient presets
export const gradients = {
  background: ['#0A0F1A', '#0E1420', '#0A0F1A'],
  card: ['#0E1420', '#141C2A'],
  button: ['#0A2F6C', '#1E4D8C'],
  focus10: ['#1E4D8C', '#0A2F6C'],
  focus12: ['#4B3B8C', '#2E2660'],
  focus15: ['#6B2E8C', '#4A1E6C'],
  focus21: ['#8C2E6B', '#6C1E4A'],
  focus23: ['#8C3D2E', '#6C2E1E'],
  header: ['#0A0F1A', 'transparent'],
};
