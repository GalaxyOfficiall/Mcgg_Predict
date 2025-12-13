export interface PlayerMap {
  [key: string]: string; // P1, P2, ... P8
}

export interface OpponentMap {
  I1: string; // I-2
  I2: string; // I-3
  I3: string; // I-4
  II1: string; // II-2
  II2: string; // II-4
}

export interface PredictionResult {
  round: string;
  step: number;
  opponent: string;
}

export interface PredictionTable {
  mode: number; // 1 or 2
  residualP7: string;
  residualP8: string;
  rounds: {
    roundName: string;
    matches: PredictionResult[];
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
