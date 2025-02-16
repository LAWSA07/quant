export interface RecognitionResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export type FileType = "image" | "pdf";
