import { useCallback } from 'react';

import { useStorage } from '@plasmohq/storage/hook';

import type { Session } from '~/types/Session';

export const useActiveSessions = () => {
  const [sessions, setSessions] = useStorage<Session[]>('active-session', []);

  const getActiveSession = useCallback(
    (domain: string) => {
      return sessions?.find(
        (s) => s.domain === domain && s.expireDate > Date.now(),
      );
    },
    [sessions],
  );

  const startSession = useCallback(
    (domain: string, durationMinutes: number) => {
      const expireDate = Date.now() + durationMinutes * 1000 * 60;

      setSessions((prevSessions) => {
        const cleaned = (prevSessions || []).filter(
          (s) => s.expireDate > Date.now() && s.domain !== domain,
        );
        return [...cleaned, { domain, expireDate }];
      });
    },
    [setSessions],
  );

  const endSession = useCallback(
    (domain: string) => {
      setSessions((prevSessions) =>
        (prevSessions || []).filter((s) => s.domain !== domain),
      );
    },
    [setSessions],
  );

  return {
    getActiveSession,
    startSession,
    endSession,
  };
};
