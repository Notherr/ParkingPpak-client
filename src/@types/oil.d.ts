export {};

declare global {
  type OilType = 'LPG' | 'GASOLINE' | 'VIA' | 'PREMIUM' | 'ELECTRIC';

  type OilInfo = {
    type: OilType;
    price: string;
    diff: number;
    percentile: number;
  };
}
