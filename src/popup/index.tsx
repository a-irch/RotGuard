import { Button } from '@/components/ui/button';
import logo from 'data-base64:~../assets/icon512.png';

import '@/globals.css';

import { Cog } from 'lucide-react';

const IndexPopup = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="flex w-[16rem] items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="RotGuard Logo"
          className="h-8 w-8 object-contain"
        />
        <h1 className="text-xl font-bold">RotGuard</h1>
      </div>

      <Button variant="ghost" size="icon" onClick={openOptions}>
        <Cog className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default IndexPopup;
