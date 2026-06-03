import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function GreenScreen() {
  const theme = useTheme();
  const greenColor = theme.green;

  return (
    <ThemedView style={[styles.container, { backgroundColor: greenColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.text}>
          초록색 화면
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Green Screen
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});
