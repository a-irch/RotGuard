import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import '@/globals.css';

import { Toaster } from '@/components/ui/sonner';

import RestrictList from './RestrictList';
import SessionTime from './SessionTime';

const Options = () => {
  return (
    <>
      <div className="mx-auto flex w-[52rem] flex-col gap-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Options</CardTitle>
            <CardDescription>
              Modify RotGuard settings to match your needs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SessionTime />
            <RestrictList />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
};

export default Options;
