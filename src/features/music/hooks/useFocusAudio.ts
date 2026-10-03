import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useState } from 'react';

import { TRACKS } from '../constants/tracks';

export function useFocusAudio() {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const player = useAudioPlayer(TRACKS[0].source, {
    updateInterval: 500,
  });

  const playback = useAudioPlayerStatus(player);

  const toggleTrack = useCallback(
    (trackIndex: number) => {
      if (selectedTrack === trackIndex && playback.playing) {
        player.pause();
        return;
      }

      if (selectedTrack !== trackIndex) {
        player.replace(TRACKS[trackIndex].source);
        setSelectedTrack(trackIndex);
      }

      player.play();
    },
    [player, playback.playing, selectedTrack],
  );

  const stopAudio = useCallback(() => {
    if (player.playing) {
      player.pause();
    }

    setSelectedTrack(null);
  }, [player]);

  return {
    tracks: TRACKS,
    selectedTrack,
    playback,
    toggleTrack,
    stopAudio,
  };
}