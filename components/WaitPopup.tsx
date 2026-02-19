import { useEffect, useState } from 'react';

import { useStorage } from '@plasmohq/storage/hook';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';

const WaitPopup = () => {
  const [waitingTime] = useStorage<number>('waiting-time', 15);
  const [sessionDuration] = useStorage<number>('session-duration', 10);

  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(waitingTime);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const cancel = () => {
    chrome.runtime.sendMessage({ action: 'CLOSE_TAB' });
  };

  const setTabMute = (shouldMute: boolean) => {
    chrome.runtime.sendMessage({ action: 'MUTE_TAB', value: shouldMute });
  };

  useEffect(() => {
    if (!isAccepted) return;

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
      setIsVisible(false);
      setTabMute(false);
      setTimeout(
        () => {
          setIsVisible(true);
          setIsAccepted(false);
          setProgress(0);
          setTabMute(true);
        },
        sessionDuration * 1000 * 60,
      );
    };

    return () => clearInterval(interval);
  }, [isAccepted]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xl">
      <Card className="w-[33rem] text-lg">
        <CardHeader>
          <CardTitle className="text-2xl">This page is restricted</CardTitle>
          <CardDescription className="text-xl">
            You need to wait before accessing to this page...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isAccepted ? (
            <>
              <p>Do you really need to access this page ?</p>
              <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => cancel()}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAccepted(!isAccepted)}>
                  Access
                </Button>
              </div>
            </>
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
