import { useCallback, useEffect, useState } from 'react';

import {
  readStorageValue,
  writeStorageValue,
} from '../../../services/storage';

import { ProfileData } from '../types';

// Safely validate and sanitize stored profile data
function normalizeProfileData(
  value: unknown,
  fallbackName: string,
): ProfileData {
  if (!value || typeof value !== 'object') {
    return {
      name: fallbackName,
      completedSessions: 0,
    };
  }

  const candidate = value as Record<string, unknown>;

  // Check if saved name is a valid non-empty string
  const hasValidName =
    typeof candidate.name === 'string' &&
    candidate.name.trim().length > 0;

  const name = hasValidName
    ? (candidate.name as string).trim()
    : fallbackName;

  // Check if saved completed sessions is a valid number
  const hasValidSessions =
    typeof candidate.completedSessions === 'number' &&
    Number.isFinite(candidate.completedSessions);

  const completedSessions = hasValidSessions
    ? Math.max(
        0,
        Math.floor(candidate.completedSessions as number),
      )
    : 0;

  return {
    name,
    completedSessions,
  };
}

// Custom hook to manage user profile state
export function useProfile(uid: string, email: string) {
  const defaultName =
    email.split('@')[0]?.trim() || 'there';

  const storageKey = `focusflow:profile:${uid}`;

  const [profile, setProfile] = useState<ProfileData>({
    name: defaultName,
    completedSessions: 0,
  });

  const [nameDraft, setNameDraft] = useState(defaultName);
  const [profileReady, setProfileReady] = useState(false);

  // Load saved profile data from storage on mount
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const savedProfile = await readStorageValue<unknown>(
        storageKey,
        {
          name: defaultName,
          completedSessions: 0,
        },
      );

      if (!isMounted) {
        return;
      }

      const normalized = normalizeProfileData(
        savedProfile,
        defaultName,
      );

      setProfile(normalized);
      setNameDraft(normalized.name);
    };

    loadProfile()
      .catch((error) => {
        console.warn('Failed to load profile:', error);

        if (isMounted) {
          setProfile({
            name: defaultName,
            completedSessions: 0,
          });
          setNameDraft(defaultName);
        }
      })
      .finally(() => {
        if (isMounted) {
          setProfileReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [defaultName, storageKey]);

  // Save profile data whenever it changes
  useEffect(() => {
    if (profileReady) {
      void writeStorageValue(storageKey, profile);
    }
  }, [profile, profileReady, storageKey]);

  // Save the edited display name
  const saveName = useCallback(() => {
    const nextName = nameDraft.trim();

    if (!nextName) {
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      name: nextName,
    }));

    setNameDraft(nextName);
  }, [nameDraft]);

  // Increment the count of completed focus sessions
  const incrementCompletedSessions = useCallback(() => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      completedSessions: currentProfile.completedSessions + 1,
    }));
  }, []);

  return {
    profile,
    nameDraft,
    setNameDraft,
    saveName,
    incrementCompletedSessions,
    profileReady,
  };
}