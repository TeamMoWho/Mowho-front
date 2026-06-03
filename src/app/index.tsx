import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mowho" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            커뮤니티에 오신 것을 환영합니다! 👋
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            Mowho는 사람들과 소통하고 경험을 나누는 플랫폼입니다.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            피드
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            친구들의 최신 소식을 확인해보세요
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            추천
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            관심 있을 만한 콘텐츠를 발견해보세요
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  cardTitle: {
    marginBottom: Spacing.one,
  },
  cardDescription: {
    opacity: 0.7,
  },
});
