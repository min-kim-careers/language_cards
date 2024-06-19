export const ELEMENT_WIDTH = 300;

export interface Word {
  id: number;
  korean: string;
  english: string;
  origin: string;
  word_grade: string;
  pos: string;
  url: string | null;
}

export enum DisplayOrder {
  FrontFirst = 'FrontFirst',
  BackFirst = 'BackFirst',
  Alternate = 'Alternate'
}

export interface Settings {
  displayOrder: DisplayOrder;
  shuffled: boolean;
}