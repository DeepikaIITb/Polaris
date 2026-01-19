
export enum StrategyType {
  WARM_UP_POLL = 'Warm-Up Poll',
  CURIOSITY_TRIGGER = 'Curiosity Trigger',
  THINK_PAIR_SHARE = 'Think-Pair-Share',
  SELF_REFLECTION = 'Self-Reflection'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Step {
  phase: string;
  time?: string;
  action: string;
  prompt?: string;
  goal?: string;
  aiTip?: string;
}

export interface DisciplineExample {
  discipline: string;
  example: string;
  practiceLink?: string;
}

export interface StrategyData {
  id: StrategyType;
  purpose: string;
  totalTime: string;
  flow: Step[];
  tips: string[];
  mistakes?: string[];
  tools?: string;
  toolLink?: string;
  extraContent?: string;
  demoImage?: string;
  demoCaption?: string;
  reflectionPrompts?: string[];
  disciplineExamples?: DisciplineExample[];
  instructionalNote?: string;
}
