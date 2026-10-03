import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { FocusTrack } from '../../music/types';
import { colors } from '../../../theme/colors';

export default function FocusScreen({
  email,
  onLogout,
  formattedTime,
  durationMinutes,
  progress,
  timerRunning,
  remainingSeconds,
  tracks,
  selectedTrack,
  playback,
  onToggleTimer,
  onResetTimer,
  onAdjustDuration,
  onToggleTrack,
}: {
  email: string;
  onLogout: () => void;
  formattedTime: string;
  durationMinutes: number;
  progress: number;
  timerRunning: boolean;
  remainingSeconds: number;
  tracks: FocusTrack[];
  selectedTrack: number | null;
  playback: { playing: boolean };
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAdjustDuration: (change: number) => void;
  onToggleTrack: (index: number) => void;
}) {
  const ringRadius = 106;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Focus session</Text>

        <Pressable
          onPress={onLogout}
          style={styles.logout}
          accessibilityRole="button"
          accessibilityLabel={`Sign out ${email}`}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      <Text style={styles.focusLabel}>Focus</Text>

      <View style={styles.timerWrap}>
        <Svg width={232} height={232} viewBox="0 0 232 232">
          <Circle
            cx="116"
            cy="116"
            r={ringRadius}
            fill="none"
            stroke={colors.border}
            strokeWidth="8"
          />

          <Circle
            cx="116"
            cy="116"
            r={ringRadius}
            fill="none"
            stroke={colors.primary}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringCircumference * (1 - progress)}
            transform="rotate(-90 116 116)"
          />
        </Svg>

        <Text style={styles.time}>{formattedTime}</Text>
      </View>

      <View style={styles.timerActions}>
        <Pressable
          style={styles.primaryAction}
          onPress={onToggleTimer}
          accessibilityRole="button"
        >
          <Ionicons
            name={timerRunning ? 'pause' : 'play'}
            size={16}
            color={colors.surface}
          />

          <Text style={styles.primaryActionText}>
            {timerRunning
              ? 'Pause'
              : remainingSeconds === 0
                ? 'Start again'
                : 'Start'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryAction}
          onPress={onResetTimer}
          accessibilityRole="button"
          accessibilityLabel="Reset timer"
        >
          <Ionicons
            name="refresh"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.secondaryActionText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.durationControls}>
        <Text style={styles.durationLabel}>SESSION LENGTH</Text>

        <View style={styles.durationStepper}>
          <Pressable
            style={styles.stepButton}
            onPress={() => onAdjustDuration(-5)}
            disabled={durationMinutes <= 5}
            accessibilityRole="button"
            accessibilityLabel="Decrease session by 5 minutes"
          >
            <Ionicons
              name="remove"
              size={19}
              color={
                durationMinutes <= 5
                  ? colors.textMuted
                  : colors.primary
              }
            />
          </Pressable>

          <Text style={styles.durationValue}>
            {durationMinutes} min
          </Text>

          <Pressable
            style={styles.stepButton}
            onPress={() => onAdjustDuration(5)}
            disabled={durationMinutes >= 120}
            accessibilityRole="button"
            accessibilityLabel="Increase session by 5 minutes"
          >
            <Ionicons
              name="add"
              size={19}
              color={
                durationMinutes >= 120
                  ? colors.textMuted
                  : colors.primary
              }
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.musicHeader}>
        <Text style={styles.section}>Choose your sound</Text>

        {selectedTrack !== null && playback.playing ? (
          <Text style={styles.playingLabel}>NOW PLAYING</Text>
        ) : null}
      </View>

      {tracks.map((track, index) => {
        const isSelected = selectedTrack === index;
        const isPlaying = isSelected && playback.playing;

        return (
          <View
            style={[styles.row, isSelected && styles.selectedRow]}
            key={track.fileName}
          >
            <Image
              source={require('../../../../assets/Background.jpg')}
              style={styles.trackImage}
            />

            <View style={styles.copy}>
              <Text style={styles.title}>{track.title}</Text>

              <Text style={styles.meta}>
                {track.description}
              </Text>
            </View>

            <Pressable
              style={styles.play}
              onPress={() => onToggleTrack(index)}
              accessibilityRole="button"
              accessibilityLabel={`${isPlaying ? 'Pause' : 'Play'} ${track.title}`}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={16}
                color={colors.primary}
              />
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: '700',
  },
  logout: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusLabel: {
    color: colors.primary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  timerWrap: {
    width: 232,
    height: 232,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    position: 'absolute',
    color: colors.textPrimary,
    fontSize: 46,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  timerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 14,
  },
  primaryAction: {
    width: 112,
    height: 42,
    borderRadius: 22,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryAction: {
    width: 96,
    height: 42,
    borderRadius: 22,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  secondaryActionText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  durationControls: {
    alignItems: 'center',
    marginTop: 15,
  },
  durationLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  durationStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationValue: {
    minWidth: 56,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  musicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 9,
  },
  section: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  playingLabel: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedRow: {
    backgroundColor: colors.primaryTint,
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 7,
  },
  copy: {
    flex: 1,
    marginLeft: 11,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  play: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});