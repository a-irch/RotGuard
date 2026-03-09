import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';

import type { DailyLimitSession, Page } from '~/types/Page';

interface SiteStatusProps {
  currentDomain: string;
  isRestricted: boolean;
  currentPage?: Page;
  sessionsToday: number;
  dailyLimit: DailyLimitSession;
  onRestrict: () => void;
}

const SiteStatus = ({
  currentDomain,
  isRestricted,
  currentPage,
  sessionsToday,
  dailyLimit,
  onRestrict,
}: SiteStatusProps) => {
  if (!currentDomain) {
    return (
      <div className="rounded-lg bg-muted/50 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Cannot restrict this page.
        </p>
      </div>
    );
  }

  if (isRestricted) {
    const progressValue =
      dailyLimit !== 'none'
        ? (sessionsToday / (dailyLimit as number)) * 100
        : 0;

    return (
      <div className="rounded-lg bg-muted/50 p-4 text-center">
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="progress-upload" className="flex w-full">
            <span>{currentPage?.name} sessions today</span>
            <span className="ml-auto">
              {sessionsToday}
              {dailyLimit !== 'none' && `/${dailyLimit}`}
            </span>
          </FieldLabel>
          {dailyLimit !== 'none' && (
            <Progress value={progressValue} id="progress-upload" />
          )}
        </Field>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted/50 p-4 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Unrestricted site</p>
        <Button onClick={onRestrict} size="sm" className="w-full">
          Restrict {currentDomain}
        </Button>
      </div>
    </div>
  );
};

export default SiteStatus;
