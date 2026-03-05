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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileJson, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useRestrictList } from '~/hooks/useRestrictList';
import { useSettings } from '~/hooks/useSettings';
import type { Page } from '~/types/Page';

const ImportDialog = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const {
    waitingTime,
    sessionDuration,
    dailyLimit,
    displayRemaining,
    setWaitingTime,
    setSessionDuration,
    setDailyLimit,
    setDisplayRemaining,
  } = useSettings();
  const { restrictList, overwriteList } = useRestrictList();

  useEffect(() => {
    if (open) {
      const currentConfig = {
        version: '1.0',
        settings: {
          waitingTime,
          sessionDuration,
          dailyLimit,
          displayRemaining,
        },
        restrictList: restrictList || [],
      };
      setJsonInput(JSON.stringify(currentConfig, null, 2));
    } else {
      setJsonInput('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      if (!jsonInput.trim()) throw new Error('Empty input');
      const data = JSON.parse(jsonInput);

      if (!data.settings || !Array.isArray(data.restrictList)) {
        throw new Error('Invalid format: Missing settings or restrictList');
      }

      if (data.settings.waitingTime !== undefined)
        setWaitingTime(data.settings.waitingTime);
      if (data.settings.sessionDuration !== undefined)
        setSessionDuration(data.settings.sessionDuration);
      if (data.settings.dailyLimit !== undefined)
        setDailyLimit(data.settings.dailyLimit);
      if (data.settings.displayRemaining !== undefined)
        setDisplayRemaining(data.settings.displayRemaining);

      overwriteList(data.restrictList as Page[]);

      toast.success('Settings imported successfully!', {
        description: 'Your configuration has been restored.',
        position: 'bottom-right',
      });

      setOpen(false);
      setJsonInput('');
    } catch (error) {
      toast.error('Failed to import', {
        description: 'The JSON format is invalid or corrupted.',
        position: 'bottom-right',
      });
      console.error('Import error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Upload className="h-4 w-4" />
          Import Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Configuration</DialogTitle>
          <DialogDescription>
            Upload a backup file or paste your JSON configuration directly
            below. This will overwrite your current settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="relative">
            <div className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground">
              Modify/Paste JSON here
            </div>
            <Textarea
              className="min-h-[250px] font-mono text-xs"
              placeholder='{"version": "1.0", "settings": {...}}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 p-4">
            <FileJson className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Or upload a backup file</p>
              <Input
                type="file"
                accept=".json"
                className="mt-1.5 cursor-pointer bg-background"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonInput.trim()}
            className="gap-2">
            <Upload className="h-4 w-4" />
            Apply Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
