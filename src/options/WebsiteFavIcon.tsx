import { SearchXIcon } from 'lucide-react';
import { useState } from 'react';

const WebsiteFavicon = ({ domain, name }: { domain: string; name: string }) => {
  const [error, setError] = useState(false);

  if (error) return <SearchXIcon size={20} />;

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt={`${name}'s icon`}
      width={20}
      height={20}
      onError={() => setError(true)}
    />
  );
};

export default WebsiteFavicon;
