import theme from '../styles/theme';
import { Disaster } from '../types/disaster';

export const disastersKor = ['산불', '산사태', '홍수', '폭설', '황사'] as const;
export const disasters = ['WILDFIRE', 'LANDSLIDE', 'FLOOD', 'SNOW', 'DUST'] as const;

export const disasterMap: {
  [key: string]: Disaster;
} = {
  산불: 'WILDFIRE',
  산사태: 'LANDSLIDE',
  홍수: 'FLOOD',
  폭설: 'SNOW',
  황사: 'DUST',
};

export const disasterToKorMap: Record<Disaster, string> = {
  WILDFIRE: '산불',
  LANDSLIDE: '산사태',
  FLOOD: '홍수',
  SNOW: '폭설',
  DUST: '황사',
};

export const disasterColorMap: Record<Disaster, string> = {
  WILDFIRE: theme.color.fire,
  LANDSLIDE: theme.color.landSlide,
  FLOOD: theme.color.rain,
  SNOW: theme.color.snow,
  DUST: theme.color.dust,
};
