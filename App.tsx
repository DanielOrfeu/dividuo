import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import Routes from './src/routes';

export default function App() {
  return (

    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Routes/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
