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
} from 'react-native';
import { Colors } from '@/constants/theme';

interface LoginProps {
  onLoginSuccess?: () => void;
  onSignUp?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onSignUp }: LoginProps) {
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
    onSignUp?.();
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: '#9E9E9E',
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
