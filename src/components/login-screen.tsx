import { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

interface LoginProps {
  onLoginSuccess?: () => void;
  onSignUp?: () => void;
}

const VALID_USERNAME = 'mowho123';
const VALID_PASSWORD = 'mowho12345';

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
    setTimeout(() => {
      setLoading(false);
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        onLoginSuccess?.();
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다');
      }
    }, 500);
  };

  const handleSignUp = () => {
    onSignUp?.();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
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
          <View style={[styles.descriptionContainer, { opacity: 0 }]}>
            <View style={styles.descriptionWrapper}>
              <Text style={[styles.description, styles.descriptionOutline, { top: -0.8 }]}>
                당신이 찾던 바로 그 후기,{'\n'}
                취향 저격 리뷰, 여기서 확인하세요
              </Text>
              <Text style={[styles.description, styles.descriptionOutline, { top: 0.8 }]}>
                당신이 찾던 바로 그 후기,{'\n'}
                취향 저격 리뷰, 여기서 확인하세요
              </Text>
              <Text style={[styles.description, styles.descriptionOutline, { left: -0.8 }]}>
                당신이 찾던 바로 그 후기,{'\n'}
                취향 저격 리뷰, 여기서 확인하세요
              </Text>
              <Text style={[styles.description, styles.descriptionOutline, { left: 0.8 }]}>
                당신이 찾던 바로 그 후기,{'\n'}
                취향 저격 리뷰, 여기서 확인하세요
              </Text>
              <Text style={styles.description}>
                당신이 찾던 바로 그 후기,{'\n'}
                취향 저격 리뷰, 여기서 확인하세요
              </Text>
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
    </KeyboardAwareScrollView>
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
    height: height * 0.55,
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
  descriptionContainer: {
    alignItems: 'center',
  },
  descriptionWrapper: {
    position: 'relative',
  },
  descriptionOutline: {
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.8)',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  description: {
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '900',
    fontFamily: 'Jua',
  },
  formContainer: {
    gap: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 53,
    fontSize: 16,
    color: Colors.light.text,
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
  },
  signUpButton: {
    backgroundColor: '#2BB509',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
  },
});
