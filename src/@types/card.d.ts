export {};

declare global {
  type CardType = 'SINHAN' | 'SAMSUNG' | 'KB' | 'HYUNDAI';

  type Card = {
    id: number;
    name: string;
    companyName: string;
    content: string;
  };
}
