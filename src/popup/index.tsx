import '@/globals.css';

import { type ChartConfig } from '@/components/ui/chart';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent } from '~/components/ui/card';
import { useRestrictList } from '~/hooks/useRestrictList';
import { useSettings } from '~/hooks/useSettings';

import PopupHeader from './PopupHeader';
import SiteStatus from './SiteStatus';
import StatsCharts from './StatsCharts';

const IndexPopup = () => {
  const { restrictList, addPage } = useRestrictList();
  const { dailyLimit } = useSettings();
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

  const currentPage = restrictList?.find(
    (page) =>
      currentDomain === page.domain ||
      currentDomain.endsWith('.' + page.domain),
  );

  const isRestricted = !!currentPage;

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US');
    });
  }, []);

  const currentSiteData = useMemo(() => {
    return last7Days.map((date) => {
      const [m, d] = date.split('/');
      const formattedDate = `${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
      return {
        date: formattedDate,
        sessions: currentPage?.stats?.[date] || 0,
      };
    });
  }, [last7Days, currentPage]);

  const { globalData, globalChartConfig } = useMemo(() => {
    const CHART_COLORS = [
      '#3b82f6',
      '#f43f5e',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
    ];
    const data = last7Days.map((date) => {
      const [m, d] = date.split('/');
      const formattedDate = `${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dayData: any = { date: formattedDate };
      restrictList?.forEach((page) => {
        dayData[page.name] = page.stats?.[date] || 0;
      });
      return dayData;
    });

    const config: ChartConfig = {};
    restrictList?.forEach((page, index) => {
      config[page.name] = {
        label: page.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return { globalData: data, globalChartConfig: config };
  }, [last7Days, restrictList]);

  const singleChartConfig = {
    sessions: { label: 'Sessions', color: '#3b82f6' },
  } satisfies ChartConfig;

  return (
    <Card className="w-[24rem] border-none">
      <PopupHeader />

      <CardContent>
        <SiteStatus
          currentDomain={currentDomain}
          isRestricted={isRestricted}
          currentPage={currentPage}
          sessionsToday={currentPage?.stats?.[last7Days[0]] || 0}
          dailyLimit={dailyLimit}
          onRestrict={quickRestrict}
        />

        <StatsCharts
          isRestricted={isRestricted}
          restrictList={restrictList || []}
          currentSiteData={currentSiteData}
          globalData={globalData}
          globalChartConfig={globalChartConfig}
          singleChartConfig={singleChartConfig}
        />
      </CardContent>
    </Card>
  );
};

export default IndexPopup;
