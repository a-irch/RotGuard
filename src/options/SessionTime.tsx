import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useStorage } from '@plasmohq/storage/hook';

const SessionTime = () => {
  const [waitingTime, setWaitingTime] = useStorage<number>('waiting-time', 15);
  const [sessionDuration, setSessionDuration] = useStorage<number>(
    'session-duration',
    10,
  );

  const [localWaitingTime, setLocalWaitingTime] = useState<number>(15);
  const [localSessionDuration, setLocalSessionDuration] = useState<number>(10);

  useEffect(() => {
    setLocalWaitingTime(waitingTime);
    setLocalSessionDuration(sessionDuration);
  }, [waitingTime, sessionDuration]);

  const handleSave = () => {
    setWaitingTime(localWaitingTime);
    setSessionDuration(localSessionDuration);
    toast.success('Setting applied !', {
      description: 'New session time settings have been well applied',
      position: 'bottom-right',
    });
  };

  return (
    <div>
      <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
        Session Configuration
      </h2>

      <div className="flex flex-row gap-4">
        <Field>
          <FieldLabel htmlFor="session-duration">
            Session duration (minutes)
          </FieldLabel>
          <FieldDescription>
            Time allowed on the website before the popup returns.
          </FieldDescription>
          <Input
            id="session-duration"
            type="number"
            min="1"
            placeholder="example : 10"
            value={localSessionDuration}
            onChange={(e) => setLocalSessionDuration(Number(e.target.value))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="waiting-time">Waiting time (seconds)</FieldLabel>
          <FieldDescription>
            Time you must wait looking at the popup.
          </FieldDescription>
          <Input
            id="waiting-time"
            type="number"
            min="1"
            placeholder="Ex: 15"
            value={localWaitingTime}
            onChange={(e) => setLocalWaitingTime(Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={
            localSessionDuration === sessionDuration &&
            localWaitingTime === waitingTime
          }>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SessionTime;
