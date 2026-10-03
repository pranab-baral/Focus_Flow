import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../theme/colors';

// Props passed to the ProfileScreen from the parent tab navigator
interface ProfileScreenProps {
  email: string;
  name: string;
  onLogout: () => void;
  nameDraft: string;
  setNameDraft: (value: string) => void;
  saveName: () => void;
  completedSessions: number;
  completedTasks: number;
}

export default function ProfileScreen({
  email,
  name,
  onLogout,
  nameDraft,
  setNameDraft,
  saveName,
  completedSessions,
  completedTasks,
}: ProfileScreenProps) {
  // Use first character of the user's name for their avatar, with fallback
  const avatarLetter = (name.trim()[0] || '?').toUpperCase();
  const isSaveDisabled = !nameDraft.trim();

  return (
    <ScrollView
      contentContainerStyle={styles.profileContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header with title and Logout button */}
      <View style={styles.header}>
        <Text style={styles.heading}>Your profile</Text>
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

      {/* User Avatar, Name, and Email summary */}
      <View style={styles.profileIdentity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>

      {/* Name edit form */}
      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Your name</Text>
        <Text style={styles.profileHint}>
          This name appears on your Home screen.
        </Text>
        <View style={styles.nameForm}>
          <TextInput
            style={styles.nameInput}
            value={nameDraft}
            onChangeText={setNameDraft}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            maxLength={40}
            returnKeyType="done"
            onSubmitEditing={saveName}
            accessibilityLabel="Your name"
          />
          <Pressable
            style={[
              styles.saveNameButton,
              isSaveDisabled && styles.saveNameDisabled,
            ]}
            onPress={saveName}
            disabled={isSaveDisabled}
            accessibilityRole="button"
            accessibilityLabel="Save name"
          >
            <Text style={styles.saveNameText}>Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.profileStats}>
        <View style={styles.statIcon}>
          <Ionicons
            name="checkmark-done-outline"
            size={22}
            color={colors.accentBright}
          />
        </View>
        <View style={styles.statCopy}>
          <Text style={styles.statLabel}>Completed focus sessions</Text>
          <Text style={styles.statCaption}>
            Sessions finished before the timer ended
          </Text>
        </View>
        <Text style={styles.statValue}>{completedSessions}</Text>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.statIcon}>
          <Ionicons
            name="checkbox-outline"
            size={22}
            color={colors.accentBright}
          />
        </View>
        <View style={styles.statCopy}>
          <Text style={styles.statLabel}>Completed tasks</Text>
          <Text style={styles.statCaption}>Tasks checked off your list</Text>
        </View>
        <Text style={styles.statValue}>{completedTasks}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
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
  profileIdentity: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 34,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 13,
  },
  profileEmail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },
  profileSection: {
    paddingVertical: 19,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  profileSectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  profileHint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
  nameForm: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 13,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    color: colors.textPrimary,
    fontSize: 14,
  },
  saveNameButton: {
    minWidth: 72,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  saveNameDisabled: {
    opacity: 0.45,
  },
  saveNameText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 16,
    gap: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCopy: {
    flex: 1,
  },
  statLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  statCaption: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

