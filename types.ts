export interface Note {
  id: string;
  originalText: string;
  transformedText: string;
  quote?: string;
  createdAt: number;
}

export type AppState = 'HOME' | 'INPUT' | 'PROCESSING_CRUMPLE' | 'PROCESSING_THROW' | 'REVIEW_PROMPT' | 'TRANSFORMING' | 'RESULT' | 'GALLERY';