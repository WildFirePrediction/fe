import React, { memo } from 'react';
import { NaverMapPolygonOverlay, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { TimeStepMarker } from '../assets/svgs/icons';
import {
  buildPolygonForStep,
  buildSquarePolygonForCell,
  coordsToFullCoords,
} from '../utils/mapUtil';
import { fireTimestepLayerMap, fireTimestepMap } from '../constants/categories';
import theme from '../styles/theme';
import { useFirePrediction } from '../context/firePredictionContext';

const FireAreaOvarlay: React.FC = () => {
  const { firePredictionDatas } = useFirePrediction();

  if (!firePredictionDatas || firePredictionDatas.length === 0) {
    return null;
  }

  return (
    <>
      {firePredictionDatas.map(firePredictionData => {
        return firePredictionData.predictions.map(step =>
          step.predicted_cells.map((cell, idx) => {
            const coords = buildSquarePolygonForCell(cell);
            if (!coords || coords.length === 0) return null;
            console.log(`square polygon: ${firePredictionData.fire_id} - ${step.timestep}`);

            return (
              <NaverMapPolygonOverlay
                key={`cell-${firePredictionData.fire_id}-${step.timestep}-${idx}`}
                coords={coords}
                color={fireTimestepLayerMap[step.timestep]}
              />
            );
          }),
        );
      })}
      {firePredictionDatas.map(firePredictionData => {
        return firePredictionData.predictions.map(step => {
          const centerLat = firePredictionData.fire_location.lat;
          const centerLon = firePredictionData.fire_location.lon;

          const points = coordsToFullCoords(step.predicted_cells);
          if (!points || points.length === 0) return null;

          const hullCoords = buildPolygonForStep(step, centerLat, centerLon);
          if (!hullCoords || hullCoords.length === 0) return null;

          return (
            <React.Fragment key={`hull-${step.timestep}`}>
              <NaverMapMarkerOverlay
                key={`${firePredictionData.fire_id}-${step.timestep}-marker`}
                latitude={hullCoords[0].latitude}
                longitude={hullCoords[0].longitude}
                caption={{ text: `${step.timestep * 10}분 후`, haloColor: theme.color.white }}
                isHideCollidedCaptions={true}
              >
                <TimeStepMarker />
              </NaverMapMarkerOverlay>

              <NaverMapPolygonOverlay
                key={`${firePredictionData.fire_id}-${step.timestep}-polygon`}
                coords={hullCoords}
                color={fireTimestepLayerMap[step.timestep]}
                outlineWidth={1.5}
                outlineColor={fireTimestepMap[step.timestep]}
                zIndex={5 - step.timestep}
              />
            </React.Fragment>
          );
        });
      })}
    </>
  );
};

export default memo(FireAreaOvarlay);
