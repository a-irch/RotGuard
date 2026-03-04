import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { toast } from 'sonner';

import { useStorage } from '@plasmohq/storage/hook';

import { Switch } from '~/components/ui/switch';

const Display = () => {
  const [displayRemaining, setDisplayRemaining] = useStorage<boolean>(
    'display-remaining',
    false,
  );

  const handleToggle = (checked: boolean) => {
    setDisplayRemaining(checked);
    toast.success(checked ? 'Timer enabled' : 'Timer disabled', {
      description: checked
        ? 'The countdown will now appear on restricted sites.'
        : 'The countdown is now hidden.',
      position: 'bottom-right',
    });
  };

  return (
    <div className="mt-4">
      <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
        Display Settings
      </h2>

      <div className="flex flex-row gap-4">
        <Field
          orientation="horizontal"
          className="mb-4 w-full items-center justify-between gap-6">
          <FieldContent>
            <FieldLabel htmlFor="display-remaining">
              Show remaining time
            </FieldLabel>
            <FieldDescription>
              Display the RotGuard logo and a session countdown in the bottom
              right corner of restricted pages.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="display-remaining"
            checked={displayRemaining}
            onCheckedChange={handleToggle}
          />
        </Field>
      </div>
    </div>
  );
};

export default Display;
