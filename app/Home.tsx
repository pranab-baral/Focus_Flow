import { useCallback, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import FocusScreen from '../src/features/focus/screens/FocusScreen';
import HomeScreen from '../src/features/home/screens/HomeScreen';
import { useFocusAudio } from '../src/features/music/hooks/useFocusAudio';
import ProfileScreen from '../src/features/profile/screens/ProfileScreen';
import { useProfile } from '../src/features/profile/hooks/useProfile';
import { useTasks } from '../src/features/tasks/hooks/useTasks';
import { useFocusTimer } from '../src/features/timer/hooks/useFocusTimer';
import { colors } from '../src/theme/colors';

type ActiveTab = 'home' | 'focus' | 'profile';

interface HomeProps {
  uid: string;
  email: string;
  onLogout: () => void;
}

export default function Home({ uid, email, onLogout }: HomeProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const logoutInProgress = useRef(false);

  const {
    profile,
    nameDraft,
    setNameDraft,
    saveName,
    incrementCompletedSessions,
  } = useProfile(uid, email);

  const {
    tasks,
    taskDraft,
    setTaskDraft,
    addTask,
    toggleTask,
    deleteTask,
    remainingTaskCount,
    completedTaskCount,
  } = useTasks(uid);

  const {
    tracks,
    selectedTrack,
    playback,
    toggleTrack,
    stopAudio,
  } = useFocusAudio();

  const handleLogout = useCallback(async () => {
    if (logoutInProgress.current) {
      return;
    }

    logoutInProgress.current = true;

    try {
      stopAudio();
      await onLogout();
    } catch (error) {
      logoutInProgress.current = false;
      throw error;
    }
  }, [onLogout, stopAudio]);

  const handleSessionComplete = useCallback(() => {
    incrementCompletedSessions();
    stopAudio();
  }, [incrementCompletedSessions, stopAudio]);

  const {
    durationMinutes,
    formattedTime,
    progress,
    timerRunning,
    remainingSeconds,
    startOrPause,
    resetTimer,
    adjustDuration,
  } = useFocusTimer({
    uid,
    onSessionComplete: handleSessionComplete,
  });

  const handleToggleTimer = useCallback(() => {
    if (timerRunning) {
      startOrPause();
      stopAudio();
      return;
    }

    startOrPause();
  }, [startOrPause, stopAudio, timerRunning]);

  const handleResetTimer = useCallback(() => {
    resetTimer();
    stopAudio();
  }, [resetTimer, stopAudio]);

  const handleAdjustDuration = useCallback(
    (change: number) => {
      adjustDuration(change);
      stopAudio();
    },
    [adjustDuration, stopAudio],
  );

  const renderTabContent = () => {
    if (activeTab === 'focus') {
      return (
        <FocusScreen
          email={email}
          onLogout={handleLogout}
          formattedTime={formattedTime}
          durationMinutes={durationMinutes}
          progress={progress}
          timerRunning={timerRunning}
          remainingSeconds={remainingSeconds}
          tracks={tracks}
          selectedTrack={selectedTrack}
          playback={playback}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
          onAdjustDuration={handleAdjustDuration}
          onToggleTrack={toggleTrack}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <ProfileScreen
          email={email}
          name={profile.name}
          onLogout={handleLogout}
          nameDraft={nameDraft}
          setNameDraft={setNameDraft}
          saveName={saveName}
          completedSessions={profile.completedSessions}
          completedTasks={completedTaskCount}
        />
      );
    }

    return (
      <HomeScreen
        email={email}
        name={profile.name}
        onLogout={handleLogout}
        tasks={tasks}
        taskDraft={taskDraft}
        setTaskDraft={setTaskDraft}
        addTask={addTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        remainingTaskCount={remainingTaskCount}
        durationMinutes={durationMinutes}
        onGoToFocus={() => setActiveTab('focus')}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {renderTabContent()}

      <View style={styles.tabBar}>
        <Pressable
          style={styles.tab}
          onPress={() => setActiveTab('home')}
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityState={{ selected: activeTab === 'home' }}
        >
          <Entypo
            name="home"
            size={20}
            color={
              activeTab === 'home'
                ? colors.primary
                : colors.textMuted
            }
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => setActiveTab('focus')}
          accessibilityRole="button"
          accessibilityLabel="Focus"
          accessibilityState={{ selected: activeTab === 'focus' }}
        >
          <Image
            source={require('../assets/Focus-icon.png')}
            style={styles.focusTabIcon}
            resizeMode="contain"
          />
          <Text style={[styles.tabText, activeTab === 'focus' && styles.activeTabText]}>
            Focus
          </Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => setActiveTab('profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          accessibilityState={{ selected: activeTab === 'profile' }}
        >
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={
              activeTab === 'profile'
                ? colors.primary
                : colors.textMuted
            }
          />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: 28,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  focusTabIcon: {
    width: 22,
    height: 22,
  },
});