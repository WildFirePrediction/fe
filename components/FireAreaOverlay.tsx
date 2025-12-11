import React, { memo } from 'react';
import {
  NaverMapPolygonOverlay,
  NaverMapMarkerOverlay,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { TimeStepMarker } from '../assets/svgs/icons';
import {
  buildPolygonForStep,
  buildSquarePolygonForCell,
  coordsToFullCoords,
} from '../utils/mapUtil';
import { fireTimestepLayerMap, fireTimestepMap } from '../constants/categories';
import theme from '../styles/theme';
import { useFirePrediction } from '../context/firePredictionContext';
import { LocationCoord } from '../types/locationCoord';

interface FireAreaOverlayProps {
  mapRef?: React.RefObject<NaverMapViewRef | null>;
}

const FireAreaOvarlay: React.FC<FireAreaOverlayProps> = ({ mapRef }: FireAreaOverlayProps) => {
  const { firePredictionDatas } = useFirePrediction();

  if (!firePredictionDatas || firePredictionDatas.length === 0) {
    return null;
  }

  const handleZoom = (coord: LocationCoord) => {
    if (mapRef)
      mapRef.current?.animateCameraTo({
        latitude: coord.lat,
        longitude: coord.lon,
        zoom: 13,
      });
  };

  return (
    <>
      {firePredictionDatas.map(firePredictionData => {
        return firePredictionData.predictions.map(step =>
          step.predicted_cells.map((cell, idx) => {
            const coords = buildSquarePolygonForCell(cell);
            if (!coords || coords.length === 0) return null;
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
                latitude={hullCoords[1].latitude}
                longitude={hullCoords[1].longitude}
                caption={{ text: `${step.timestep * 10}분 후`, haloColor: theme.color.white }}
                isHideCollidedCaptions={true}
                minZoom={13}
              >
                <TimeStepMarker />
              </NaverMapMarkerOverlay>

              <NaverMapPolygonOverlay
                key={`${firePredictionData.fire_id}-${step.timestep}-polygon`}
                coords={hullCoords}
                color={fireTimestepLayerMap[step.timestep]}
                outlineWidth={1.5}
                outlineColor={fireTimestepMap[step.timestep]}
                globalZIndex={100000}
              />
            </React.Fragment>
          );
        });
      })}
      {firePredictionDatas.map(prediction => (
        <NaverMapMarkerOverlay
          key={`fire=${prediction.fire_id}`}
          latitude={prediction.fire_location.lat}
          longitude={prediction.fire_location.lon}
          image={{ symbol: 'red' }}
          onTap={() => handleZoom(prediction.fire_location)}
        />
      ))}
    </>
  );
};

export default memo(FireAreaOvarlay);
