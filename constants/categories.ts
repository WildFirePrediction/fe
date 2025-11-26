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
