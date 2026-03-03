import logo from 'data-base64:~../assets/icon512.png';
import { useEffect, useState } from 'react';

import type { Session } from '~/types/Session';

const RemainingTime = ({ activeSession }: { activeSession: Session }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const diff = activeSession.expireDate - Date.now();
      if (diff <= 0) return setTimeLeft('00:00');

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  return (
    <div className="group fixed bottom-6 right-6 z-[9999] flex items-center justify-end">
      <div className="flex max-w-[44px] flex-row-reverse items-center overflow-hidden rounded-lg border border-border bg-card/80 p-1.5 align-middle shadow-lg backdrop-blur-md transition-all duration-500 ease-in-out group-hover:max-w-[160px]">
        <img src={logo} className="h-9 w-9 object-contain" alt="RotGuard" />

        <span className="text-md ml-2 mr-4 font-mono font-bold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default RemainingTime;
