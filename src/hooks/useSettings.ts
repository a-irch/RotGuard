import { useStorage } from '@plasmohq/storage/hook';

import type { DailyLimitSession } from '~/types/Page';

export const useSettings = () => {
  const [waitingTime, setWaitingTime] = useStorage<number>('waiting-time', 15);
  const [sessionDuration, setSessionDuration] = useStorage<number>(
    'session-duration',
    10,
  );
  const [dailyLimit, setDailyLimit] = useStorage<DailyLimitSession>(
    'daily-limit',
    'none',
  );
  const [displayRemaining, setDisplayRemaining] = useStorage<boolean>(
    'display-remaining',
    false,
  );

  return {
    waitingTime,
    sessionDuration,
    dailyLimit,
    displayRemaining,
    setWaitingTime,
    setSessionDuration,
    setDailyLimit,
    setDisplayRemaining,
  };
};
