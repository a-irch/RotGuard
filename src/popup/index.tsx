import { Button } from '@/components/ui/button';
import logo from 'data-base64:~../assets/icon512.png';

import '@/globals.css';

import { Cog } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useRestrictList } from '~/hooks/useRestrictList';

const IndexPopup = () => {
  const { restrictList, addPage } = useRestrictList();
  const [currentDomain, setCurrentDomain] = useState<string>('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.url) {
        try {
          const url = new URL(activeTab.url);
          if (url.protocol.startsWith('http')) {
            const domain = url.hostname.replace('www.', '');
            setCurrentDomain(domain);
          }
        } catch (error) {
          console.error("Can't read tab URL :", error);
        }
      }
    });
  }, []);

  const quickRestrict = () => {
    if (!currentDomain) return;

    const defaultName = currentDomain.split('.')[0];
    const capitalizedName =
      defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    addPage({ name: capitalizedName, domain: currentDomain });
  };

  const isRestricted = restrictList?.some(
    (page) =>
      currentDomain === page.domain ||
      currentDomain.endsWith('.' + page.domain),
  );

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[16rem]">
      <div className="flex items-center justify-between p-4">
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
      <div className="m-6 flex flex-col">
        {currentDomain ? (
          isRestricted ? (
            <p className="text-center text-sm font-medium text-muted-foreground">
              This page is already restricted.
            </p>
          ) : (
            <Button onClick={quickRestrict} className="w-full">
              Restrict this site
            </Button>
          )
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Cannot restrict this page.
          </p>
        )}
      </div>

      <div className="h-px w-full bg-border" />
    </div>
  );
};

export default IndexPopup;
