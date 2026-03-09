import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import type { Page } from '~/types/Page';

interface Data {
  date: string;
  sessions: number;
}

interface StatsChartsProps {
  isRestricted: boolean;
  restrictList: Page[];
  currentSiteData: Data[];
  globalData: Data[];
  globalChartConfig: ChartConfig;
  singleChartConfig: ChartConfig;
}

const StatsCharts = ({
  isRestricted,
  restrictList,
  currentSiteData,
  globalData,
  globalChartConfig,
  singleChartConfig,
}: StatsChartsProps) => {
  return (
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
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
                radius={[4, 4, 0, 0]}
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
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
  );
};

export default StatsCharts;
