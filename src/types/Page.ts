export interface Page {
  name: string;
  domain: string;
  customSession?: {
    waitingTime: number;
    sessionDuration: number;
  };
}
