import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">프로필</ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar} />
            <ThemedText type="subtitle">사용자 이름</ThemedText>
            <ThemedText type="default" style={styles.email}>
              user@example.com
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle">계정 설정</ThemedText>
            <View style={styles.settingItem}>
              <ThemedText>개인정보 수정</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText>비밀번호 변경</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText>알림 설정</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle">기타</ThemedText>
            <View style={styles.settingItem}>
              <ThemedText>도움말</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText>로그아웃</ThemedText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  email: {
    marginTop: 4,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  settingItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
});
