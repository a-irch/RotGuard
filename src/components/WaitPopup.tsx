import { useEffect, useState } from 'react';

import { useStorage } from '@plasmohq/storage/hook';

import type { DailyLimitSession, Page } from '~/types/Page';
import type { Session } from '~/types/Session';

import RemainingTime from './RemainingTime';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';

const WaitPopup = ({ domain }: { domain: string }) => {
  const [waitingTime] = useStorage<number>('waiting-time', 15);
  const [sessionDuration] = useStorage<number>('session-duration', 10);
  const [dailyLimit] = useStorage<DailyLimitSession>('daily-limit', 'none');

  const [sessions, setSessions] = useStorage<Session[]>('active-session', []);
  const [displayRemaining] = useStorage<boolean>('display-remaining', false);
  const [restrictList, setRestrictList] = useStorage<Page[]>(
    'restrict-list',
    [],
  );

  const today = new Date().toLocaleDateString('en-US');
  const currentPage = restrictList?.find(
    (p) => p.domain === domain || domain.endsWith('.' + p.domain),
  );

  const sessionsToday = currentPage?.stats?.[today] || 0;

  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(waitingTime);

  const activeSession = sessions?.find(
    (s) => s.domain === domain && s.expireDate > Date.now(),
  );
  const isAuthorized = !!activeSession;

  const cancel = () => {
    chrome.runtime.sendMessage({ action: 'CLOSE_TAB' });
  };

  const setTabMute = (shouldMute: boolean) => {
    chrome.runtime.sendMessage({ action: 'MUTE_TAB', value: shouldMute });
  };

  useEffect(() => {
    if (!isAccepted || isAuthorized) return;

    const startTime = Date.now();
    const duration = waitingTime * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;

      const newProgress = Math.min((elapsed / duration) * 100, 100);
      const remainingSeconds = Math.ceil((duration - elapsed) / 1000);

      setProgress(newProgress);
      setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleEndWaiting();
      }
    }, 20);

    const handleEndWaiting = () => {
      setTabMute(false);
      const expireDate = Date.now() + sessionDuration * 1000 * 60;
      const cleanedSessions = (sessions || []).filter(
        (s) => s.expireDate > Date.now() && s.domain !== domain,
      );
      setSessions([...cleanedSessions, { domain, expireDate }]);

      setRestrictList((prev) =>
        prev.map((page) => {
          if (page.domain === domain || domain.endsWith('.' + page.domain)) {
            const newStats = { ...(page.stats || {}) };
            newStats[today] = (newStats[today] || 0) + 1;
            return { ...page, stats: newStats };
          }
          return page;
        }),
      );

      setIsAccepted(false);
      setProgress(0);
    };

    return () => clearInterval(interval);
  }, [
    isAccepted,
    isAuthorized,
    sessionDuration,
    waitingTime,
    domain,
    sessions,
    setSessions,
    setRestrictList,
    today,
  ]);

  useEffect(() => {
    if (isAuthorized) {
      const timeRemaining = activeSession.expireDate - Date.now();

      const timer = setTimeout(() => {
        setTabMute(true);
        setSessions((prev) => prev.filter((s) => s.domain !== domain));
      }, timeRemaining);

      return () => clearTimeout(timer);
    }
  }, [isAuthorized, activeSession, domain, setSessions]);

  if (isAuthorized) {
    if (displayRemaining)
      return <RemainingTime activeSession={activeSession} />;
    else return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xl">
      <Card className="w-[33rem] text-lg">
        <CardHeader>
          <CardTitle className="text-2xl">This page is restricted</CardTitle>
          <CardDescription className="text-xl">
            You need to wait before accessing this page...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isAccepted ? (
            dailyLimit === 'none' || sessionsToday <= dailyLimit ? (
              <>
                <p>Do you really need to access this page ?</p>
                <p>
                  You already use {sessionsToday}
                  {sessionsToday > 1 ? ' sessions ' : ' session '}
                  {dailyLimit !== 'none' && `on ${dailyLimit}`} today
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => cancel()}>
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setIsAccepted(!isAccepted)}>
                    Access
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>Daily session limit reached. Come back tomorrow !</p>
              </>
            )
          ) : (
            <div className="flex flex-col gap-4 duration-300 animate-in fade-in zoom-in">
              <p className="text-center font-medium">
                Accessing page in{' '}
                <span className="font-bold text-primary">{timeLeft}</span>{' '}
                seconds
              </p>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitPopup;
