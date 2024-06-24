export const ELEMENT_WIDTH = 300;

export const ANONYMOUS = 'anonymous';

export interface Word {
  word_id: number;
  korean: string;
  english: string;
  origin?: string;
  word_grade?: string;
  pos?: string;
  url?: string | null;
}

export enum DisplayOrder {
  KoreanFirst = 'KoreanFirst',
  EnglishFirst = 'EnglishFirst',
  Alternate = 'Alternate',
}

export interface Settings {
  displayOrder: DisplayOrder;
  shuffled: boolean;
  favouriteFolders: string[];
}

export const DEFAULT_SETTINGS = {
  displayOrder: DisplayOrder.KoreanFirst,
  shuffled: false,
  favouriteFolders: [],
};
