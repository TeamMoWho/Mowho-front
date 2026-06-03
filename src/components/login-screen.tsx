import { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      // TODO: 실제 API 호출
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess?.();
      }, 1000);
    } catch (error) {
      setLoading(false);
      alert('로그인 실패');
    }
  };

  const handleSignUp = () => {
    // TODO: 회원가입 화면으로 이동
    alert('회원가입 페이지로 이동합니다');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          {/* 로고 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoTextWrapper}>
              <Text style={[styles.brandName, styles.outlineText, { top: -1 }]}>MoWho</Text>
              <Text style={[styles.brandName, styles.outlineText, { top: 1 }]}>MoWho</Text>
              <Text style={[styles.brandName, styles.outlineText, { left: -1, right: 1 }]}>MoWho</Text>
              <Text style={[styles.brandName, styles.outlineText, { left: 1, right: -1 }]}>MoWho</Text>
              <Text style={styles.brandName}>MoWho</Text>
            </View>
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              당신이 찾던 바로 그 후기,{'\n'}
              쉬향, 저것 리뷰, 여기서 확인하세요
            </Text>
          </View>
        </View>

        {/* 입력 필드 */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디"
            placeholderTextColor={Colors.light.textSecondary}
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor={Colors.light.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary, // 밝은 초록색
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  topSection: {
    marginBottom: height * 0.1,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoTextWrapper: {
    position: 'relative',
  },
  brandName: {
    fontSize: 85,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    fontFamily: 'Modak',
  },
  outlineText: {
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.7)',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '800',
    fontFamily: 'Inter',
    textShadowColor: 'rgba(56, 71, 43, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
  },
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: Colors.light.primary,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
