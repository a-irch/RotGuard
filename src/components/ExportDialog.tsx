import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useRestrictList } from '~/hooks/useRestrictList';
import { useSettings } from '~/hooks/useSettings';

import { Switch } from './ui/switch';

const ExportDialog = () => {
  const { waitingTime, sessionDuration, dailyLimit, displayRemaining } =
    useSettings();
  const { restrictList } = useRestrictList();

  const [includeStats, setIncludeStats] = useState(false);

  const getExportData = () => {
    const exportedList = includeStats
      ? restrictList
      : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        restrictList?.map(({ stats, ...pageWithoutStats }) => pageWithoutStats);

    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      settings: {
        waitingTime,
        sessionDuration,
        dailyLimit,
        displayRemaining,
      },
      restrictList: exportedList || [],
    };
    return JSON.stringify(backup, null, 2);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportData());
      toast.success('Backup copied to clipboard!', {
        position: 'bottom-right',
      });
    } catch (_err) {
      toast.error('Failed to copy', { position: 'bottom-right' });
    }
  };

  const handleDownload = () => {
    const data = getExportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `rotguard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Backup file downloaded!', {
      position: 'bottom-right',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Configuration</DialogTitle>
          <DialogDescription>
            Copy this JSON or download it as a file to back up your RotGuard
            settings and restricted sites.
          </DialogDescription>
        </DialogHeader>

        <FieldLabel htmlFor="include-stats">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Include usage statistics</FieldTitle>
              <FieldDescription>
                Export your daily session counts along with your restricted
                websites.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="include-stats"
              checked={includeStats}
              onCheckedChange={setIncludeStats}
            />
          </Field>
        </FieldLabel>

        <div className="relative mt-2">
          <pre className="max-h-[300px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs text-muted-foreground">
            {getExportData()}
          </pre>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <Button variant="secondary" onClick={handleCopy} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy to clipboard
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
