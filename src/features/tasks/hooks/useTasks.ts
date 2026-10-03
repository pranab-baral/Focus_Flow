import { useCallback, useEffect, useMemo, useState } from 'react';

import { readStorageValue, writeStorageValue } from '../../../services/storage';
import { TaskItem } from '../types';


// Check if an unknown stored item has the shape of a TaskItem
function isValidTask(item: unknown): item is TaskItem {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const candidate = item as Record<string, unknown>;
  const hasId = typeof candidate.id === 'string';
  const hasTitle = typeof candidate.title === 'string';
  const hasCompleted = typeof candidate.completed === 'boolean';

  return hasId && hasTitle && hasCompleted;
}

// Convert any loaded data into a safe array of valid tasks
function normalizeTasks(value: unknown): TaskItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isValidTask);
}

// Custom hook to manage user tasks, including persistence in local storage
export function useTasks(uid: string) {
  const storageKey = `focusflow:tasks:${uid}`;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskDraft, setTaskDraft] = useState('');
  const [tasksReady, setTasksReady] = useState(false);

  // Load saved tasks from AsyncStorage when the user ID is ready
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const savedTasks = await readStorageValue<TaskItem[]>(storageKey, []);

      if (isMounted) {
        setTasks(normalizeTasks(savedTasks));
      }
    };

    loadTasks()
      .catch((error) => {
        console.warn('Failed to load tasks:', error);
        if (isMounted) {
          setTasks([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setTasksReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  // Save tasks to AsyncStorage whenever tasks change after initial load
  useEffect(() => {
    if (tasksReady) {
      void writeStorageValue(storageKey, tasks);
    }
  }, [storageKey, tasks, tasksReady]);

  // Add a new task using the text in the input draft
  const addTask = useCallback(() => {
    const title = taskDraft.trim();

    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: `${Date.now()}-${currentTasks.length}`,
        title,
        completed: false,
      },
    ]);

    setTaskDraft('');
  }, [taskDraft]);

  // Toggle a task between completed and incomplete
  const toggleTask = useCallback((taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  // Remove a task from the list
  const deleteTask = useCallback((taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }, []);

  // Derived counts for UI display
  const remainingTaskCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  );

  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  return {
    tasks,
    taskDraft,
    setTaskDraft,
    addTask,
    toggleTask,
    deleteTask,
    remainingTaskCount,
    completedTaskCount,
    tasksReady,
  };
}

