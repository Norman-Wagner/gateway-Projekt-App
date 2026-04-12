import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface BinauralPlayerProps {
  baseFrequency: number;
  beatFrequency: number;
  isPlaying: boolean;
  volume?: number;
}

export const BinauralPlayer: React.FC<BinauralPlayerProps> = ({
  baseFrequency,
  beatFrequency,
  isPlaying,
  volume = 0.3,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background: transparent; }
      </style>
    </head>
    <body>
      <script>
        let audioContext = null;
        let leftOscillator = null;
        let rightOscillator = null;
        let gainNode = null;
        let isInitialized = false;

        function initAudio() {
          if (isInitialized) return;
          
          try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            
            // Create merger for stereo output
            const merger = audioContext.createChannelMerger(2);
            
            // Left oscillator
            leftOscillator = audioContext.createOscillator();
            leftOscillator.type = 'sine';
            const leftGain = audioContext.createGain();
            leftOscillator.connect(leftGain);
            leftGain.connect(merger, 0, 0);
            
            // Right oscillator
            rightOscillator = audioContext.createOscillator();
            rightOscillator.type = 'sine';
            const rightGain = audioContext.createGain();
            rightOscillator.connect(rightGain);
            rightGain.connect(merger, 0, 1);
            
            merger.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            leftOscillator.start();
            rightOscillator.start();
            
            isInitialized = true;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
          } catch (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: e.message }));
          }
        }

        function setFrequencies(base, beat) {
          if (!isInitialized) initAudio();
          if (leftOscillator && rightOscillator) {
            leftOscillator.frequency.setValueAtTime(base, audioContext.currentTime);
            rightOscillator.frequency.setValueAtTime(base + beat, audioContext.currentTime);
          }
        }

        function setVolume(vol) {
          if (gainNode) {
            gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
          }
        }

        function play() {
          if (!isInitialized) initAudio();
          if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
          }
          setVolume(${volume});
        }

        function stop() {
          setVolume(0);
        }

        // Message handler
        window.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            switch(data.action) {
              case 'init':
                initAudio();
                break;
              case 'play':
                play();
                break;
              case 'stop':
                stop();
                break;
              case 'setFrequencies':
                setFrequencies(data.base, data.beat);
                break;
              case 'setVolume':
                setVolume(data.volume);
                break;
            }
          } catch (e) {
            console.error('Message parse error:', e);
          }
        });

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
        });
      </script>
    </body>
    </html>
  `;

  const sendMessage = useCallback((message: object) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      sendMessage({ action: 'setFrequencies', base: baseFrequency, beat: beatFrequency });
    }
  }, [baseFrequency, beatFrequency, isReady, sendMessage]);

  useEffect(() => {
    if (isReady) {
      if (isPlaying) {
        sendMessage({ action: 'play' });
      } else {
        sendMessage({ action: 'stop' });
      }
    }
  }, [isPlaying, isReady, sendMessage]);

  useEffect(() => {
    if (isReady) {
      sendMessage({ action: 'setVolume', volume });
    }
  }, [volume, isReady, sendMessage]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'loaded' || data.type === 'ready') {
        setIsReady(true);
        sendMessage({ action: 'init' });
        sendMessage({ action: 'setFrequencies', base: baseFrequency, beat: beatFrequency });
      }
    } catch (e) {
      console.error('WebView message error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  webview: {
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
});
