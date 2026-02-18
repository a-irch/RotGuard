import { SearchXIcon } from "lucide-react";
import { useState } from "react";

const WebsiteFavicon = ({ url, name }: { url: string, name: string }) => {
    const [error, setError] = useState(false);

    if (error) return <SearchXIcon size={20}/>;

    return (
        <img 
            src={url.replace('*', 'favicon.ico')} 
            alt={`${name}'s icon`} 
            width={20} 
            height={20}
            onError={() => setError(true)}
        />
    );
}

export default WebsiteFavicon;