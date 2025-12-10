import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import EventSource from 'react-native-sse';
import { FireEndResponse, FirePredictionResponse } from '../apis/types/fire';
import { firePredictionData } from '../mock/firePredictionData';

const FIRE_PREDICTION_SSE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
interface FirePredictionContextValue {
  firePredictionDatas: FirePredictionResponse[];
  isConnected: boolean;
  error: Error | null;
}

const FirePredictionContext = createContext<FirePredictionContextValue | undefined>(undefined);

type FirePredictionProviderProps = {
  children: React.ReactNode;
};

export const FirePredictionProvider: React.FC<FirePredictionProviderProps> = ({ children }) => {
  const [firePredictionDatas, setFirePredictionDatas] = useState<FirePredictionResponse[]>([]);
  // const [firePredictionDatas, setFirePredictionDatas] =
  //   useState<FirePredictionResponse[]>(firePredictionData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const url = `${FIRE_PREDICTION_SSE_BASE_URL}/fires/sse-stream`;

    let isUnmounted = false;

    const es = new EventSource(url, {
      headers: {},
      withCredentials: false,
    });

    es.addEventListener('open', () => {
      if (isUnmounted) return;
      console.log('[SSE] FirePrediction open');
      setIsConnected(true);
      setError(null);
    });

    es.addEventListener('fire_prediction' as any, (event: any) => {
      if (isUnmounted) return;
      if (!event.data) return;
      console.log(`[SSE] fire_prediction data: ${event.data}`);
      try {
        const newData: FirePredictionResponse = JSON.parse(event.data);

        setFirePredictionDatas(prev => {
          const exists = prev.some(item => item.fire_id === newData.fire_id);
          return exists
            ? prev.map(item => (item.fire_id === newData.fire_id ? newData : item))
            : [...prev, newData];
        });
      } catch (e) {
        console.log('[SSE] parse error', e);
        setError(e instanceof Error ? e : new Error('Failed to parse SSE message'));
      }
    });

    es.addEventListener('fire_end' as any, (event: any) => {
      if (isUnmounted) return;
      if (!event.data) return;
      console.log(`[SSE] end data: ${event.data}`);
      try {
        const endData: FireEndResponse = JSON.parse(event.data);
        setFirePredictionDatas(prev => {
          if (!prev) return prev;
          return prev.filter(item => item.fire_id !== endData.fire_id);
        });
      } catch (e) {
        console.log('[SSE] parse error', e);
        setError(e instanceof Error ? e : new Error('Failed to parse SSE message'));
      }
    });

    es.addEventListener('error', evt => {
      if (isUnmounted) return;
      console.log('[SSE] error', evt);
      setIsConnected(false);
      setError(new Error('SSE connection error'));
      // 필요하면 여기서 재연결 로직 넣을 수 있음
    });

    return () => {
      console.log('[SSE] closing');
      isUnmounted = true;
      es.close();
      setIsConnected(false);
    };
  }, []);

  const value = useMemo(
    () => ({
      firePredictionDatas,
      isConnected,
      error,
    }),
    [firePredictionDatas, isConnected, error],
  );

  return <FirePredictionContext.Provider value={value}>{children}</FirePredictionContext.Provider>;
};

export const useFirePrediction = () => {
  const ctx = useContext(FirePredictionContext);
  if (!ctx) {
    throw new Error('useFirePrediction must be used within FirePredictionProvider');
  }
  return ctx;
};
