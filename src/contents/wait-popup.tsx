import WaitPopup from '@/components/WaitPopup';
import type { Page } from '@/types/Page';
import cssText from 'data-text:@/globals.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect, useState } from 'react';

import { useStorage } from '@plasmohq/storage/hook';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  all_frames: true,
};

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

const WaitPopUp = () => {
  const [restrictList] = useStorage<Page[]>('restrict-list', []);
  const [shouldShow, setShouldShow] = useState(false);

  const [currentDomain, setCurrentDomain] = useState<string>('');

  useEffect(() => {
    if (!restrictList || restrictList.length === 0) {
      setShouldShow(false);
      return;
    }

    const domain = window.location.hostname.replace('www.', '');
    setCurrentDomain(domain);

    const isRestricted = restrictList.some((page) => {
      return domain === page.domain || domain.endsWith('.' + page.domain);
    });

    if (isRestricted) {
      chrome.runtime.sendMessage({ action: 'MUTE_TAB', value: true });
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [restrictList]);

  if (!shouldShow) return null;

  return <WaitPopup domain={currentDomain} />;
};

export default WaitPopUp;
