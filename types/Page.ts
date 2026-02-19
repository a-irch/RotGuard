export interface Page {
  name: string;
  url: string;
  customSession?: {
    waitingTime: number;
    sessionDuration: number;
  };
}
