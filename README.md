# 안전나침반 - FE

산불 확산 예측 데이터를 **실시간(SSE)** 으로 수신하고, 지도(Naver Map) 위에 예측 범위를 시각화하며 **개인화된 대피 안내**를 제공하는 React Native 프런트엔드입니다.


---
## 주요 기능
### 1. 메인화면- 실시간 산불 지도
![Adobe Express - file](https://github.com/user-attachments/assets/14b883c9-88af-4afd-94be-1a39289b38b9) ![KakaoTalk_20251221_181813606](https://github.com/user-attachments/assets/5b875257-03c7-45ac-a2ad-f0e99a20607f)
### 2. 대피 경로 안내
![KakaoTalk_20251221_181533127_02](https://github.com/user-attachments/assets/526645fe-dfa0-4283-83ec-590907fa21ea) ![KakaoTalk_20251221_191251889_02](https://github.com/user-attachments/assets/ab693767-340e-4e42-acc6-560b6934e345) 
### 3. 재난 데이터 조회
![KakaoTalk_20251221_181533127_05](https://github.com/user-attachments/assets/36ce212e-94a1-4c92-aa7b-2a96111fd15e) ![KakaoTalk_20251221_181533127_04](https://github.com/user-attachments/assets/d1ed6056-3c85-4d89-b9f0-bac1ee75d2f9)
### 4. 관심지역 설정
![KakaoTalk_20251221_181533127_07](https://github.com/user-attachments/assets/49a6000e-7c23-4bf1-9e66-1c2759f37e56) ![KakaoTalk_20251221_181533127_06](https://github.com/user-attachments/assets/f9df3607-b481-4b73-b1c4-f24b67efa6ea)







## 주요 기술

- **SSE 기반 실시간 예측 데이터 스트리밍**
  - 서버에서 예측 결과가 갱신될 때마다 이벤트를 즉시 수신
  - 앱 전역 단일 연결(싱글톤)로 중복 연결 방지

- **지도 기반 시각화 (Naver Map)**
  - timestep 별 예측 좌표를 polygon으로 묶어 오버레이 렌더링
  - 다중 산불(fire_id) 동시 표시 및 관리

- **렌더링 성능 최적화**
  - `useMemo`로 polygon 계산 캐싱
  - `React.memo`, `useCallback`으로 불필요한 리렌더 최소화
  - 안정적인 참조 유지로 지도 인터랙션(이동/확대) 부드럽게 유지

---

## 기술 스택

- React Native + Expo
- TypeScript
- Expo Router (라우팅)
- Naver Map SDK (지도/오버레이)
- SSE (Server-Sent Events)

---

