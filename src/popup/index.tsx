import { Button } from '@/components/ui/button';
import logo from 'data-base64:~../assets/icon512.png';

import '@/globals.css';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cog } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldLabel } from '~/components/ui/field';
import { Progress } from '~/components/ui/progress';
import { useRestrictList } from '~/hooks/useRestrictList';
import { useSettings } from '~/hooks/useSettings';

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
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US');
    });
  }, []);

  const currentSiteData = useMemo(() => {
    return last7Days.map((date) => {
      const shortDate = date.split('/').slice(0, 2).join('/');
      return {
        date: shortDate,
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
      const shortDate = date.split('/').slice(0, 2).join('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dayData: any = { date: shortDate };
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

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Card className="w-[24rem] border-none">
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
      <CardContent>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          {currentDomain ? (
            isRestricted ? (
              <Field className="w-full max-w-sm">
                <FieldLabel htmlFor="progress-upload">
                  <span>{currentPage?.name} sessions today</span>
                  <span className="ml-auto">
                    {currentPage?.stats?.[last7Days[6]] || 0}
                    {dailyLimit !== 'none' && `/${dailyLimit}`}
                  </span>
                </FieldLabel>
                {dailyLimit !== 'none' && (
                  <Progress
                    value={
                      (currentPage?.stats?.[last7Days[6]] || 0 / dailyLimit) *
                      10
                    }
                    id="progress-upload"
                  />
                )}
              </Field>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Unrestricted site
                </p>
                <Button onClick={quickRestrict} size="sm" className="w-full">
                  Restrict {currentDomain}
                </Button>
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Cannot restrict this page.
            </p>
          )}
        </div>
        <div className="mt-4">
          <Tabs
            defaultValue={isRestricted ? 'current' : 'global'}
            className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current" disabled={!isRestricted}>
                Current Site
              </TabsTrigger>
              <TabsTrigger value="global">All Sites</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="pt-4">
              <ChartContainer
                config={singleChartConfig}
                className="h-[180px] w-full">
                <BarChart
                  data={currentSiteData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="var(--color-sessions)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="global" className="pt-4">
              <ChartContainer
                config={globalChartConfig}
                className="h-[180px] w-full">
                <BarChart
                  data={globalData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  {restrictList?.map((page) => (
                    <Bar
                      key={page.domain}
                      dataKey={page.name}
                      stackId="a"
                      fill={`var(--color-${page.name})`}
                      radius={0}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexPopup;
