import logo from 'data-base64:~../assets/icon512.png';
import { Cog } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { CardHeader, CardTitle } from '~/components/ui/card';

const PopupHeader = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-6">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="RotGuard Logo"
          className="h-10 w-10 object-contain"
        />
        <div>
          <CardTitle className="text-xl font-bold">RotGuard</CardTitle>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={openOptions}>
        <Cog className="h-5 w-5" />
      </Button>
    </CardHeader>
  );
};

export default PopupHeader;
