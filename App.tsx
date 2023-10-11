import 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import Routes from './src/routes';
import { useEffect } from 'react';
import moment from 'moment-timezone';

export default function App() {
  useEffect(() => {
    moment.tz.setDefault('America/Sao_Paulo');
  }, []);
  
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Routes/>
    </SafeAreaProvider>
  );
}