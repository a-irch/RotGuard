export interface Page {
  name: string;
  domain: string;
  customSession?: {
    waitingTime: number;
    sessionDuration: number;
  }; // Coming soon
  dailyLimit?: number; // Coming soon
  stats?: Record<string, number>;
}

export type DailyLimitSession = 'none' | number;
