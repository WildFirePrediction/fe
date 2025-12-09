import React, { memo } from 'react';
import { NaverMapPolygonOverlay, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { TimeStepMarker } from '../assets/svgs/icons';
import { FirePredictionResponse } from '../apis/types/fire';
import {
  buildPolygonForStep,
  buildSquarePolygonForCell,
  coordsToFullCoords,
} from '../utils/mapUtil';
import { fireTimestepLayerMap, fireTimestepMap } from '../constants/categories';

type Props = {
  firePredictionData: FirePredictionResponse;
  showCells?: boolean; // 각 prediction_cell 사각형
  showHull?: boolean; // timestep별 외곽 polygon + marker
};

const FirePredictionOverlays: React.FC<Props> = ({
  firePredictionData,
  showCells = true,
  showHull = true,
}) => {
  if (!firePredictionData || !firePredictionData.predictions?.length) return null;

  return (
    <>
      {/* 1) 각 prediction_cell 별 사각형 폴리곤 */}
      {showCells &&
        firePredictionData.predictions.map(step =>
          step.predicted_cells.map((cell, idx) => {
            const coords = buildSquarePolygonForCell(cell);
            if (!coords || coords.length === 0) return null;

            return (
              <NaverMapPolygonOverlay
                key={`cell-${step.timestep}-${idx}`}
                coords={coords}
                color={fireTimestepLayerMap[step.timestep]}
              />
            );
          }),
        )}

      {/* 2) timestep 별 전체 영역 hull polygon + "n분 후" 마커 */}
      {showHull &&
        firePredictionData.predictions.map(step => {
          const centerLat = firePredictionData.fire_location.lat;
          const centerLon = firePredictionData.fire_location.lon;

          const points = coordsToFullCoords(step.predicted_cells);
          if (!points || points.length === 0) return null;

          const hullCoords = buildPolygonForStep(step, centerLat, centerLon);
          if (!hullCoords || hullCoords.length === 0) return null;

          return (
            <React.Fragment key={`hull-${step.timestep}`}>
              <NaverMapMarkerOverlay
                key={`${step.timestep}-marker`}
                latitude={hullCoords[0].latitude}
                longitude={hullCoords[0].longitude}
                caption={{ text: `${step.timestep * 10}분 후` }}
              >
                {/* 기존에 쓰던 마커 컴포넌트 그대로 사용 */}
                <TimeStepMarker />
              </NaverMapMarkerOverlay>

              <NaverMapPolygonOverlay
                key={`${step.timestep}-polygon`}
                coords={hullCoords}
                color={fireTimestepLayerMap[step.timestep]}
                outlineWidth={2}
                outlineColor={fireTimestepMap[step.timestep]}
                zIndex={5 - step.timestep}
              />
            </React.Fragment>
          );
        })}
    </>
  );
};

export default memo(FirePredictionOverlays);
