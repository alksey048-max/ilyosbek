
export interface ComicPanel {
  id: string;
  panelDescription: string;
  dialogue: string;
  caption: string;
  imageUrl?: string;
  status: 'idle' | 'generating' | 'completed' | 'error';
}

export interface ComicScript {
  title: string;
  panels: ComicPanel[];
}

export enum GenerationStep {
  IDLE = 'IDLE',
  SCRIPTING = 'SCRIPTING',
  ILLUSTRATING = 'ILLUSTRATING',
  FINISHED = 'FINISHED'
}

export interface AppState {
  currentStep: GenerationStep;
  script: ComicScript | null;
  error: string | null;
  loading: boolean;
}
