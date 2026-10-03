import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/colors';

interface WaveBackgroundProps {
  height?: number;
}

export function WaveBackground({
  height = 120,
}: WaveBackgroundProps) {
  return (
    <View
      style={[styles.container, { height }]}
      pointerEvents="none"
    >
      <Svg
        width="100%"
        height={height}
        viewBox="0 0 375 120"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient
            id="waveGradBack"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <Stop
              offset="0%"
              stopColor={colors.wave1}
              stopOpacity="0.8"
            />
            <Stop
              offset="100%"
              stopColor={colors.wave2}
              stopOpacity="0.6"
            />
          </LinearGradient>

          <LinearGradient
            id="waveGradFront"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop
              offset="0%"
              stopColor={colors.wave2}
              stopOpacity="0.95"
            />
            <Stop
              offset="100%"
              stopColor={colors.wave1}
              stopOpacity="0.9"
            />
          </LinearGradient>
        </Defs>

        <Path
          d="M0,60 C90,20 180,90 270,40 C320,15 350,30 375,45 L375,120 L0,120 Z"
          fill="url(#waveGradBack)"
        />

        <Path
          d="M0,80 C80,50 160,105 260,70 C310,50 345,65 375,80 L375,120 L0,120 Z"
          fill="url(#waveGradFront)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: -1,
  },
});