import theme from '../styles/theme';
import { Disaster } from '../types/disaster';

export const disasterCategories = ['산불', '산사태', '홍수', '폭설', '황사'];

export const disasterMap: {
  [key: string]: Disaster;
} = {
  산불: 'WILDFIRE',
  산사태: 'LANDSLIDE',
  홍수: 'FLOOD',
  폭설: 'SNOW',
  황사: 'DUST',
};

export const disasterColorMap: {
  [key: string]: string;
} = {
  WILDFIRE: theme.color.fire,
  LANDSLIDE: theme.color.landSlide,
  FLOOD: theme.color.rain,
  SNOW: theme.color.snow,
  DUST: theme.color.dust,
};
