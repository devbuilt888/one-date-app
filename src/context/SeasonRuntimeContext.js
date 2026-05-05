import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ensureSeasonState,
  formatSeasonHmsClock,
  getSeasonLabel,
  loadSeasonState,
  pickRandomDoorImage,
  rollNewSeason,
} from '../lib/seasonRuntime';

const SeasonRuntimeContext = createContext(null);

export function SeasonRuntimeProvider({ children }) {
  const [snapshot, setSnapshot] = useState(() => ensureSeasonState());
  const [now, setNow] = useState(() => Date.now());
  const [doorImage, setDoorImage] = useState(() => pickRandomDoorImage());

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      let s = loadSeasonState();
      if (!s || t >= s.endsAt) {
        s = !s ? rollNewSeason(null) : rollNewSeason(s);
        setSnapshot(s);
        setDoorImage(pickRandomDoorImage());
      }
      setNow(t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo(() => {
    const remainingMs = Math.max(0, snapshot.endsAt - now);
    return {
      snapshot,
      remainingSeasonMs: remainingMs,
      seasonLabel: getSeasonLabel(snapshot),
      formattedSeasonClock: formatSeasonHmsClock(remainingMs),
      doorImage,
      requiredQuizIds: snapshot.requiredQuizIds,
    };
  }, [snapshot, now, doorImage]);

  return <SeasonRuntimeContext.Provider value={value}>{children}</SeasonRuntimeContext.Provider>;
}

export function useSeasonRuntime() {
  const ctx = useContext(SeasonRuntimeContext);
  if (!ctx) {
    throw new Error('useSeasonRuntime must be used within SeasonRuntimeProvider');
  }
  return ctx;
}
