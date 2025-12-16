export interface BirthdayContent {
  message: string;
  title: string;
  poem: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export type AppState = 'intro' | 'hunting' | 'generating' | 'reveal' | 'error';
