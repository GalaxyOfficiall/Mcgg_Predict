
export type Tab = 'predictor' | 'image' | 'chat';

export interface Round {
  name: string;
  enemy: string;
}

export interface Prediction {
  title: string;
  color: 'blue' | 'red';
  rounds: Round[];
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
