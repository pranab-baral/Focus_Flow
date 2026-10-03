import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../theme/colors';

export default function SessionCard({
  durationMinutes,
  onPress,
}: {
  durationMinutes: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.sessionCard}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.sessionIcon}>
        <Ionicons
          name="timer-outline"
          size={23}
          color={colors.accent}
        />
      </View>

      <View style={styles.sessionCopy}>
        <Text style={styles.sessionEyebrow}>
          YOUR NEXT SESSION
        </Text>

        <Text style={styles.sessionTitle}>
          Focus for {durationMinutes} minutes
        </Text>

        <Text style={styles.sessionDescription}>
          Choose a sound and begin
        </Text>
      </View>

      <Ionicons
        name="arrow-forward"
        size={20}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sessionCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 16,
    gap: 12,
  },
  sessionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionCopy: {
    flex: 1,
  },
  sessionEyebrow: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sessionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
  },
  sessionDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
});