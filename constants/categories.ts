import theme from '../styles/theme';
import { Disaster } from '../types/disaster';

export const disastersKor = ['산불', '지진', '산사태', '홍수', '폭설', '황사'] as const;
export const disasters = ['WILDFIRE', 'LANDSLIDE', 'FLOOD', 'SNOW', 'DUST'] as const;

export const disasterMap: {
  [key: string]: Disaster;
} = {
  산불: 'WILDFIRE',
  산사태: 'LANDSLIDE',
  홍수: 'FLOOD',
  폭설: 'SNOW',
  황사: 'DUST',
  지진: 'EARTHQUAKE',
};

export const disasterToKorMap: Record<Disaster, string> = {
  WILDFIRE: '산불',
  LANDSLIDE: '산사태',
  FLOOD: '홍수',
  SNOW: '폭설',
  DUST: '황사',
  EARTHQUAKE: '지진',
};

export const disasterColorMap: Record<Disaster, string> = {
  WILDFIRE: theme.color.fire,
  LANDSLIDE: theme.color.landSlide,
  FLOOD: theme.color.rain,
  SNOW: theme.color.snow,
  DUST: theme.color.dust,
  EARTHQUAKE: theme.color.landSlide,
};

export const fireTimestepMap: Record<number, string> = {
  1: theme.color.fire1,
  2: theme.color.fire2,
  3: theme.color.fire3,
  4: theme.color.fire4,
  5: theme.color.fire5,
};

export const fireTimestepLayerMap: Record<number, string> = {
  1: theme.color.fireLayer1,
  2: theme.color.fireLayer2,
  3: theme.color.fireLayer3,
  4: theme.color.fireLayer4,
  5: theme.color.fireLayer5,
};
