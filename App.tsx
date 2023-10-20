import 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import Routes from './src/routes';
import { useEffect } from 'react';
import moment from 'moment-timezone';
import { LogBox } from 'react-native';

export default function App() {
  useEffect(() => {
    moment.tz.setDefault('America/Sao_Paulo');
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state. Check:',
    ]);
  }, []);
  
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Routes/>
    </SafeAreaProvider>
  );
}