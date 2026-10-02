export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Heavy';

export interface MRTLine {
  id: string;
  code: string;
  name: string;
  terminus: string;
  color: string;
  density: 'Smooth' | 'Moderate' | 'High';
  bottleneck: string;
  nextTrainMin: number;
  direction1: string;
  direction2: string;
  stationsCount: number;
  statusMessage: string;
  stations: { code: string; name: string; crowd: CrowdLevel; waitMin: number }[];
}

export interface StationData {
  id: string;
  code: string;
  name: string;
  lines: string[];
  currentPlatform: string;
  crowdPercentage: number;
  crowdLevel: CrowdLevel;
  recommendedDeparture: string;
  recommendedWaitMins: number;
  minutesSaved: number;
  advice: string;
  carFullness: {
    car: string;
    level: 'Low' | 'Moderate' | 'Packed';
    percentage: number;
    seatsEstimate: number;
  }[];
  bestCarsAdvice: string;
  recentReport: {
    author: string;
    quote: string;
    timeAgo: string;
    upvotes: number;
  };
  source?: string;
  lastUpdated?: string;
  latencyMs?: number;
  isLive?: boolean;
  ltaConnected?: boolean;
}

export interface TelegramMessage {
  id: string;
  sender: string;
  senderType: 'bot' | 'user';
  time: string;
  title?: string;
  content: string;
  confirmedCount?: number;
  savedMins?: number;
  verifiedBy?: number;
  lineBadge?: string;
}
