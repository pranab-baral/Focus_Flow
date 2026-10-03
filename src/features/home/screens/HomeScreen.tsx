import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Logo } from '../../../components/Logo';
import { colors } from '../../../theme/colors';
import { TaskItem } from '../../tasks/types';
import SessionCard from '../components/SessionCard';

export default function HomeScreen({
  email,
  name,
  onLogout,
  tasks,
  taskDraft,
  setTaskDraft,
  addTask,
  toggleTask,
  deleteTask,
  remainingTaskCount,
  durationMinutes,
  onGoToFocus,
}: {
  email: string;
  name: string;
  onLogout: () => void;
  tasks: TaskItem[];
  taskDraft: string;
  setTaskDraft: (value: string) => void;
  addTask: () => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  remainingTaskCount: number;
  durationMinutes: number;
  onGoToFocus: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.homeContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.brandHeader}>
          <Logo size={40} />
          <Text style={styles.heading}>FocusFlow</Text>
        </View>

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

      <View style={styles.homeIntro}>
        <Text style={styles.homeEyebrow}>YOUR SPACE TO FOCUS</Text>
        <Text style={styles.homeTitle}>Welcome, {name}.</Text>
        <Text style={styles.homeDescription}>
          Set aside a little time for one thing at a time.
        </Text>
      </View>

      <View style={styles.tasksSection}>
        <View style={styles.tasksHeader}>
          <Text style={styles.detailsHeading}>Today&apos;s tasks</Text>
          <Text style={styles.taskCount}>{remainingTaskCount} left</Text>
        </View>

        <View style={styles.taskForm}>
          <TextInput
            style={styles.taskInput}
            value={taskDraft}
            onChangeText={setTaskDraft}
            placeholder="Add a task"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
            returnKeyType="done"
            onSubmitEditing={addTask}
            accessibilityLabel="New task"
          />

          <Pressable
            style={[
              styles.addTaskButton,
              !taskDraft.trim() && styles.addTaskDisabled,
            ]}
            onPress={addTask}
            disabled={!taskDraft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Add task"
          >
            <Ionicons name="add" size={22} color={colors.surface} />
          </Pressable>
        </View>

        {tasks.map((task) => (
          <View style={styles.taskRow} key={task.id}>
            <Pressable
              style={styles.taskToggle}
              onPress={() => toggleTask(task.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.completed }}
              accessibilityLabel={`${
                task.completed ? 'Mark incomplete' : 'Complete'
              } ${task.title}`}
            >
              <Ionicons
                name={
                  task.completed
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={22}
                color={
                  task.completed
                    ? colors.primary
                    : colors.textMuted
                }
              />
            </Pressable>

            <Text
              style={[
                styles.taskTitle,
                task.completed && styles.completedTask,
              ]}
            >
              {task.title}
            </Text>

            <Pressable
              style={styles.removeTaskButton}
              onPress={() => deleteTask(task.id)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${task.title}`}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          </View>
        ))}
      </View>

      <SessionCard
        durationMinutes={durationMinutes}
        onPress={onGoToFocus}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContent: {
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
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
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
  homeIntro: {
    marginTop: 76,
    marginBottom: 35,
  },
  homeEyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  homeTitle: {
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '700',
    marginTop: 12,
  },
  homeDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 300,
  },
  tasksSection: {
    marginBottom: 28,
  },
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailsHeading: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  taskCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
  taskForm: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 5,
  },
  taskInput: {
    flex: 1,
    minWidth: 0,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    color: colors.textPrimary,
    fontSize: 14,
  },
  addTaskButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskDisabled: {
    opacity: 0.45,
  },
  taskRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  taskToggle: {
    width: 38,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  taskTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  completedTask: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  removeTaskButton: {
    width: 36,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});