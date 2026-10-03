import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { readStorageValue, writeStorageValue } from '../../../services/storage';
import { TimerState } from '../types';

export function useFocusTimer({
  uid,
  defaultMinutes = 25,
  onSessionComplete,
}: {
  uid: string;
  defaultMinutes?: number;
  onSessionComplete: () => void;
}) {
  const storageKey = `focusflow:timer:${uid}`;
  const [durationMinutes, setDurationMinutes] = useState(defaultMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [timerReady, setTimerReady] = useState(false);
  const completionGuardRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadTimer = async () => {
      const savedTimer = await readStorageValue<TimerState | null>(storageKey, null);

      if (!isMounted || !savedTimer) {
        return;
      }

      const nextDuration =
        typeof savedTimer.durationMinutes === 'number' && Number.isFinite(savedTimer.durationMinutes)
          ? Math.min(120, Math.max(5, Math.round(savedTimer.durationMinutes)))
          : defaultMinutes;

      const nextRemaining =
        typeof savedTimer.remainingSeconds === 'number' && Number.isFinite(savedTimer.remainingSeconds)
          ? Math.max(0, Math.round(savedTimer.remainingSeconds))
          : nextDuration * 60;

      if (typeof savedTimer.endAt === 'number' && Number.isFinite(savedTimer.endAt)) {
        const secondsLeft = Math.max(0, Math.ceil((savedTimer.endAt - Date.now()) / 1000));
        setDurationMinutes(nextDuration);
        setRemainingSeconds(secondsLeft || 0);
        setEndAt(secondsLeft > 0 ? savedTimer.endAt : null);
        completionGuardRef.current = secondsLeft <= 0;
        return;
      }

      setDurationMinutes(nextDuration);
      setRemainingSeconds(nextRemaining);
      setEndAt(null);
    };

    loadTimer().catch((error) => {
      console.warn('Failed to load timer state:', error);
    }).finally(() => {
      if (isMounted) {
        setTimerReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [defaultMinutes, storageKey]);

  useEffect(() => {
    if (timerReady) {
      void writeStorageValue(storageKey, {
        durationMinutes,
        remainingSeconds,
        endAt,
      });
    }
  }, [durationMinutes, endAt, remainingSeconds, storageKey, timerReady]);

  useEffect(() => {
    if (endAt === null) {
      return;
    }

    const interval = setInterval(() => {
      const nextRemaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0 && !completionGuardRef.current) {
        completionGuardRef.current = true;
        setEndAt(null);
        onSessionComplete();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [endAt, onSessionComplete]);

  const startOrPause = useCallback(() => {
    if (endAt !== null) {
      const nextRemaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      completionGuardRef.current = false;
      setEndAt(null);
      return;
    }

    const seconds = remainingSeconds > 0 ? remainingSeconds : durationMinutes * 60;
    completionGuardRef.current = false;
    setRemainingSeconds(seconds);
    setEndAt(Date.now() + seconds * 1000);
  }, [durationMinutes, endAt, remainingSeconds]);

  const resetTimer = useCallback(() => {
    completionGuardRef.current = false;
    setEndAt(null);
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes]);

  const adjustDuration = useCallback(
    (change: number) => {
      const nextDuration = Math.min(120, Math.max(5, durationMinutes + change));
      completionGuardRef.current = false;
      setDurationMinutes(nextDuration);
      setRemainingSeconds(nextDuration * 60);
      setEndAt(null);
    },
    [durationMinutes],
  );

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [remainingSeconds]);

  const progress = useMemo(
    () => (durationMinutes === 0 ? 0 : remainingSeconds / (durationMinutes * 60)),
    [durationMinutes, remainingSeconds],
  );

  return {
    durationMinutes,
    remainingSeconds,
    endAt,
    formattedTime,
    progress,
    timerRunning: endAt !== null,
    timerReady,
    startOrPause,
    resetTimer,
    adjustDuration,
  };
}
