import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Switch } from '~/components/ui/switch';
import { useSettings } from '~/hooks/useSettings';

const SessionTime = () => {
  const {
    waitingTime,
    setWaitingTime,
    sessionDuration,
    setSessionDuration,
    dailyLimit,
    setDailyLimit,
  } = useSettings();

  const [localWaitingTime, setLocalWaitingTime] = useState<number>(15);
  const [localSessionDuration, setLocalSessionDuration] = useState<number>(10);
  const [localDailyLimit, setLocalDailyLimit] = useState<number>(10);

  useEffect(() => {
    setLocalWaitingTime(waitingTime);
    setLocalSessionDuration(sessionDuration);
    if (typeof dailyLimit === 'number') {
      setLocalDailyLimit(dailyLimit);
    }
  }, [waitingTime, sessionDuration, dailyLimit]);

  const handleSave = () => {
    setWaitingTime(localWaitingTime);
    setSessionDuration(localSessionDuration);
    if (dailyLimit !== 'none') {
      setDailyLimit(localDailyLimit);
    }
    toast.success('Settings applied!', {
      description: 'Your session preferences have been successfully updated.',
      position: 'bottom-right',
    });
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setDailyLimit(localDailyLimit);
      toast.success('Daily limit enabled', {
        description: `Access is now restricted to ${localDailyLimit} sessions per day.`,
        position: 'bottom-right',
      });
    } else {
      setDailyLimit('none');
      toast.success('Daily limit disabled', {
        description:
          'You can now access restricted sites without a session limit.',
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="border-t pb-4 pt-4 text-xl font-semibold">
          Session Configuration
        </h2>

        <div className="flex flex-row gap-4 pt-2">
          <Field className="flex-1">
            <FieldLabel htmlFor="session-duration">
              Session duration (minutes)
            </FieldLabel>
            <FieldDescription>
              Time allowed before the popup returns.
            </FieldDescription>
            <Input
              id="session-duration"
              type="number"
              min="1"
              value={localSessionDuration}
              onChange={(e) => setLocalSessionDuration(Number(e.target.value))}
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel htmlFor="waiting-time">
              Waiting time (seconds)
            </FieldLabel>
            <FieldDescription>
              Time spent looking at the popup.
            </FieldDescription>
            <Input
              id="waiting-time"
              type="number"
              min="1"
              value={localWaitingTime}
              onChange={(e) => setLocalWaitingTime(Number(e.target.value))}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <Field
          orientation="horizontal"
          className="flex items-center justify-between gap-4">
          <FieldContent className="flex-1">
            <FieldLabel htmlFor="daily-limit" className="mb-0">
              Daily sessions limit
            </FieldLabel>
            <FieldDescription>
              Limit the number of times you can access restricted sites each
              day.
            </FieldDescription>
          </FieldContent>
          <div className="flex items-center">
            <Switch
              id="daily-limit"
              checked={dailyLimit !== 'none'}
              onCheckedChange={handleToggle}
            />
          </div>
        </Field>

        {dailyLimit !== 'none' && (
          <div className="duration-300 animate-in fade-in slide-in-from-top-2">
            <Field
              orientation="horizontal"
              className="items-center justify-between">
              <FieldContent className="flex-1">
                <FieldLabel htmlFor="limit-input">
                  Sessions allowed per day
                </FieldLabel>
                <FieldDescription>
                  Number of times you can access restricted sites every day.
                </FieldDescription>
              </FieldContent>

              <Input
                id="limit-input"
                type="number"
                min="1"
                className="w-24"
                value={localDailyLimit}
                onChange={(e) => setLocalDailyLimit(Number(e.target.value))}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={
            localSessionDuration === sessionDuration &&
            localWaitingTime === waitingTime &&
            (dailyLimit === 'none' || localDailyLimit === dailyLimit)
          }>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SessionTime;
