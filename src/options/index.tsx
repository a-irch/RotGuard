import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import '@/globals.css';

import { Toaster } from '@/components/ui/sonner';
import { Github, Globe } from 'lucide-react';

import Display from './Display';
import RestrictList from './RestrictList';
import SessionTime from './SessionTime';
import SettingsData from './SettingsData';

const Options = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-[52rem] flex-col gap-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Options</CardTitle>
            <CardDescription>
              Modify RotGuard settings to match your needs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Display />
            <SessionTime />
            <RestrictList />
            <SettingsData />
          </CardContent>
        </Card>
      </div>
      <footer className="mx-8 my-6 mt-auto flex justify-between gap-3 pt-8 text-sm text-muted-foreground">
        <p>RotGuard • Created by a-irch</p>

        <div className="flex gap-6">
          <a
            href="https://github.com/a-irch/RotGuard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Github className="h-4 w-4" />
          </a>

          <a
            href="https://a-irch.fr/en"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Globe className="h-4 w-4" />
          </a>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Options;
