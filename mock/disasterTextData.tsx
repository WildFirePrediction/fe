import { Disaster } from '../types/disaster';
export const disasterTextData: {
  id: number;
  category: Disaster;
  region: string;
  time: string;
  content: string;
}[] = [
  {
    id: 1,
    category: 'FLOOD',
    region: '횡성',
    time: '2025.11.22 22:55',
    content:
      '오늘 16시 30분 호우주의보 발효. 개울가 하천 계곡 등 야영객은 안전한 장소로 대피하여 주시고 시설물 관리 및 안전사고에 유의하여 주시기 바랍니다',
  },
  {
    id: 2,
    category: 'LANDSLIDE',
    region: '횡성',
    time: '2025.11.22 22:55',
    content:
      '오늘 16시 30분 호우주의보 발효. 개울가 하천 계곡 등 야영객은 안전한 장소로 대피하여 주시고 시설물 관리 및 안전사고에 유의하여 주시기 바랍니다',
  },
];
