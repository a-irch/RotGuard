import { useEffect, useState } from 'react';

import { useActiveSessions } from '~/hooks/useActiveSessions';
import { useRestrictList } from '~/hooks/useRestrictList';
import { useSettings } from '~/hooks/useSettings';

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
  const { waitingTime, sessionDuration, dailyLimit, displayRemaining } =
    useSettings();
  const { restrictList, incrementDailySession } = useRestrictList();
  const { getActiveSession, startSession, endSession } = useActiveSessions();

  const today = new Date().toLocaleDateString('en-US');

  const currentPage = restrictList?.find(
    (p) => p.domain === domain || domain.endsWith('.' + p.domain),
  );

  const sessionsToday = currentPage?.stats?.[today] || 0;

  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(waitingTime);

  const activeSession = getActiveSession(domain);
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

      startSession(domain, sessionDuration);
      incrementDailySession(today, domain);

      setIsAccepted(false);
      setProgress(0);
    };

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAccepted,
    isAuthorized,
    waitingTime,
    sessionDuration,
    domain,
    startSession,
    today,
  ]);

  useEffect(() => {
    if (isAuthorized) {
      const timeRemaining = activeSession.expireDate - Date.now();

      const timer = setTimeout(() => {
        setTabMute(true);
        endSession(domain);
      }, timeRemaining);

      return () => clearTimeout(timer);
    }
  }, [isAuthorized, activeSession, domain, endSession]);

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
