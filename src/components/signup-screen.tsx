import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  InputAccessoryView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SLOT = 67;       // input height (53) + gap (14)
const INPUT_HEIGHT = 53;
const NUM_FIELDS = 6;

type UsernameStatus = 'idle' | 'duplicate' | 'available';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const formatPhone = (digits: string) => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

interface SignUpProps {
  onSignUpSuccess?: () => void;
  onBack?: () => void;
}

export default function SignUpScreen({ onSignUpSuccess, onBack }: SignUpProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [checkBtnVisible, setCheckBtnVisible] = useState(false);

  const nicknameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const fieldRefs = [nicknameRef, usernameRef, passwordRef, passwordConfirmRef, emailRef, phoneRef];

  const animYs = useRef(
    Array.from({ length: NUM_FIELDS }, () => new Animated.Value(0))
  ).current;
  const animOpacities = useRef(
    Array.from({ length: NUM_FIELDS }, (_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;
  const containerHeight = useRef(new Animated.Value(INPUT_HEIGHT)).current;
  const checkBtnOpacity = useRef(new Animated.Value(0)).current;

  const advanceStep = (currentStep: number) => {
    const nextStep = currentStep + 1;
    if (nextStep >= NUM_FIELDS) return;

    animYs[nextStep].setValue(-20);

    const animations: Animated.CompositeAnimation[] = [];

    for (let i = 0; i <= currentStep; i++) {
      animations.push(
        Animated.timing(animYs[i], {
          toValue: (nextStep - i) * SLOT,
          duration: 350,
          useNativeDriver: true,
        })
      );
    }

    animations.push(
      Animated.timing(animYs[nextStep], {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(animOpacities[nextStep], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(containerHeight, {
        toValue: INPUT_HEIGHT + nextStep * SLOT,
        duration: 350,
        useNativeDriver: false,
      })
    );

    Animated.parallel(animations).start(() => {
      setStep(nextStep);
      setTimeout(() => fieldRefs[nextStep].current?.focus(), 50);
    });
  };

  // 중복확인 버튼 등장: 닉네임을 SLOT 아래로 밀고, 컨테이너 높이 증가
  const showCheckButton = () => {
    if (checkBtnVisible) return;
    setCheckBtnVisible(true);
    Animated.parallel([
      Animated.timing(checkBtnOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(animYs[0], { toValue: 2 * SLOT, duration: 300, useNativeDriver: true }),
      Animated.timing(containerHeight, { toValue: INPUT_HEIGHT + 2 * SLOT, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  // 중복확인 버튼 퇴장 (사용자가 텍스트 지울 때): 닉네임 원위치
  const hideCheckButtonWithReset = () => {
    Animated.parallel([
      Animated.timing(checkBtnOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(animYs[0], { toValue: SLOT, duration: 300, useNativeDriver: true }),
      Animated.timing(containerHeight, { toValue: INPUT_HEIGHT + SLOT, duration: 300, useNativeDriver: false }),
    ]).start(() => setCheckBtnVisible(false));
  };

  // 중복확인 통과 후 버튼만 fade out → advanceStep
  const hideCheckButtonAndAdvance = () => {
    Animated.timing(checkBtnOpacity, { toValue: 0, duration: 200, useNativeDriver: true })
      .start(() => {
        setCheckBtnVisible(false);
        setTimeout(() => advanceStep(1), 50);
      });
  };

  const handleUsernameChange = (text: string) => {
    const filtered = text.replace(/[^a-zA-Z0-9]/g, '');
    setUsername(filtered);
    setUsernameStatus('idle');

    if (filtered.length >= 1 && !checkBtnVisible) {
      showCheckButton();
    } else if (filtered.length === 0 && checkBtnVisible) {
      hideCheckButtonWithReset();
    }
  };

  const EXISTING_USERNAMES = ['mowho123'];

  const checkDuplicate = async () => {
    if (!username.trim()) return;
    // TODO: 실제 API 호출
    const isDuplicate = EXISTING_USERNAMES.includes(username.trim());
    if (isDuplicate) {
      setUsernameStatus('duplicate');
    } else {
      setUsernameStatus('available');
      hideCheckButtonAndAdvance();
    }
  };

  const handleFieldSubmit = (fieldIndex: number) => {
    if (!values[fieldIndex].trim()) return;
    if (fieldIndex === 1) {
      checkDuplicate();
      return;
    }
    if (fieldIndex === 3) {
      if (password !== passwordConfirm) return;
    }
    if (fieldIndex < NUM_FIELDS - 1) {
      advanceStep(fieldIndex);
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (values.some(v => !v.trim())) {
      Alert.alert('알림', '모든 항목을 입력해주세요');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다');
      return;
    }
    Alert.alert(
      '회원가입',
      '가입하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            // TODO: 실제 API 호출
            onSignUpSuccess?.();
          },
        },
      ]
    );
  };

  const values = [nickname, username, password, passwordConfirm, email, phone];
  const setters = [setNickname, handleUsernameChange, setPassword, setPasswordConfirm, setEmail, setPhone];

  const passwordsMatch = password.length >= 8 && passwordConfirm.length >= 8 && password === passwordConfirm;

  const fieldConfigs = [
    { placeholder: '닉네임(2~8자)', secure: false, keyboard: 'default' as const, maxLen: 8 },
    { placeholder: '아이디', secure: false, keyboard: 'ascii-capable' as const },
    { placeholder: '비밀번호', secure: true, keyboard: 'default' as const },
    { placeholder: '비밀번호 확인', secure: true, keyboard: 'default' as const },
    { placeholder: '이메일', secure: false, keyboard: 'email-address' as const },
    { placeholder: '전화번호', secure: false, keyboard: 'phone-pad' as const, accessoryID: 'phoneInput' },
  ];

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.topSection}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.titleText, styles.titleOutline, { top: -1 }]}>Sign Up</Text>
            <Text style={[styles.titleText, styles.titleOutline, { top: 1 }]}>Sign Up</Text>
            <Text style={[styles.titleText, styles.titleOutline, { left: -1 }]}>Sign Up</Text>
            <Text style={[styles.titleText, styles.titleOutline, { left: 1 }]}>Sign Up</Text>
            <Text style={styles.titleText}>Sign Up</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>회원가입</Text>

          <Animated.View style={[styles.inputSlot, { height: containerHeight }]}>
            {/* 중복확인 버튼: username(y=0) 바로 아래 고정 위치(y=SLOT) */}
            <Animated.View style={[styles.inputAbsolute, {
              transform: [{ translateY: SLOT }],
              opacity: checkBtnOpacity,
            }]}>
              <TouchableOpacity style={styles.checkButton} onPress={checkDuplicate}>
                <Text style={styles.checkButtonText}>중복확인</Text>
              </TouchableOpacity>
            </Animated.View>

            {fieldConfigs.map((config, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.inputAbsolute,
                  {
                    transform: [{ translateY: animYs[i] }],
                    opacity: animOpacities[i],
                  },
                ]}
              >
                {i === 0 ? (
                  <View style={[styles.fieldWrapper, nickname.length >= 2 && styles.inputValid]}>
                    <TextInput
                      ref={fieldRefs[0]}
                      style={styles.fieldInner}
                      placeholder={config.placeholder}
                      placeholderTextColor={Colors.light.textSecondary}
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="none"
                      maxLength={8}
                      returnKeyType="next"
                      onSubmitEditing={() => handleFieldSubmit(0)}
                    />
                    {nickname.length >= 2 && (
                      <Text style={styles.validText}>사용 가능한 닉네임입니다</Text>
                    )}
                  </View>
                ) : i === 1 ? (
                  <View style={[
                    styles.fieldWrapper,
                    usernameStatus === 'available' && styles.inputValid,
                    usernameStatus === 'duplicate' && styles.inputDuplicate,
                  ]}>
                    <TextInput
                      ref={fieldRefs[1]}
                      style={styles.fieldInner}
                      placeholder={config.placeholder}
                      placeholderTextColor={Colors.light.textSecondary}
                      value={username}
                      onChangeText={handleUsernameChange}
                      autoCapitalize="none"
                      keyboardType="ascii-capable"
                      returnKeyType="done"
                      onSubmitEditing={() => usernameRef.current?.blur()}
                    />
                    {usernameStatus === 'available' && (
                      <Text style={styles.validText}>사용 가능한 아이디입니다</Text>
                    )}
                    {usernameStatus === 'duplicate' && (
                      <Text style={styles.duplicateText}>중복된 아이디입니다</Text>
                    )}
                  </View>
                ) : i === 2 || i === 3 ? (
                  <View style={[
                    styles.fieldWrapper,
                    i === 2 && password.length >= 8 && styles.inputValid,
                    i === 3 && passwordsMatch && styles.inputValid,
                  ]}>
                    <TextInput
                      ref={fieldRefs[i]}
                      style={styles.fieldInner}
                      placeholder={config.placeholder}
                      placeholderTextColor={Colors.light.textSecondary}
                      value={values[i]}
                      onChangeText={setters[i]}
                      secureTextEntry
                      autoCapitalize="none"
                      returnKeyType={i < NUM_FIELDS - 1 ? 'next' : 'done'}
                      onSubmitEditing={() => handleFieldSubmit(i)}
                    />
                    {i === 2 && (
                      <Text style={styles.hintText}>8자 이상</Text>
                    )}
                    {i === 3 && passwordsMatch && (
                      <Text style={styles.validText}>비밀번호가 일치합니다</Text>
                    )}
                  </View>
                ) : i === 4 ? (
                  <View style={[
                    styles.fieldWrapper,
                    email.length > 0 && isValidEmail(email) && styles.inputValid,
                    email.length > 0 && !isValidEmail(email) && styles.inputDuplicate,
                  ]}>
                    <TextInput
                      ref={fieldRefs[4]}
                      style={styles.fieldInner}
                      placeholder={config.placeholder}
                      placeholderTextColor={Colors.light.textSecondary}
                      value={email}
                      onChangeText={(text) => setEmail(text.replace(/[^\x20-\x7E]/g, ''))}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => handleFieldSubmit(4)}
                    />
                    {email.length > 0 && !isValidEmail(email) && (
                      <Text style={styles.duplicateText}>이메일 형식이 아닙니다</Text>
                    )}
                  </View>
                ) : (
                  <View style={[
                    styles.fieldWrapper,
                    phone.length === 11 && styles.inputValid,
                  ]}>
                    <TextInput
                      ref={fieldRefs[5]}
                      style={styles.fieldInner}
                      placeholder={config.placeholder}
                      placeholderTextColor={Colors.light.textSecondary}
                      value={formatPhone(phone)}
                      onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, 11))}
                      keyboardType="phone-pad"
                      inputAccessoryViewID="phoneInput"
                      returnKeyType="done"
                      onSubmitEditing={() => handleFieldSubmit(5)}
                    />
                  </View>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={styles.disclaimer}>
          가입 버튼을 누르시면 위치기반 서비스에 동의한걸로 처리됩니다
        </Text>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>가입</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID="phoneInput">
          <View style={{ height: 44, backgroundColor: Colors.light.primary }} />
        </InputAccessoryView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 41,
    left: 24,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 48,
    marginBottom: 44,
    height: SCREEN_HEIGHT * 0.22,
    justifyContent: 'center',
  },
  titleWrapper: {
    position: 'relative',
  },
  titleText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    fontFamily: 'Modak',
  },
  titleOutline: {
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.7)',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  formContainer: {
    gap: 14,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  inputSlot: {
    position: 'relative',
  },
  inputAbsolute: {
    position: 'absolute',
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: INPUT_HEIGHT,
    fontSize: 16,
    color: Colors.light.text,
  },
  fieldWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: INPUT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInner: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputValid: {
    borderWidth: 1.5,
    borderColor: '#4A90E2',
  },
  inputDuplicate: {
    borderWidth: 1.5,
    borderColor: '#E74C3C',
  },
  validText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
  hintText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
  duplicateText: {
    fontSize: 13,
    color: '#E74C3C',
    marginLeft: 8,
  },
  checkButton: {
    backgroundColor: Colors.light.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
    backgroundColor: Colors.light.primary,
    gap: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: Colors.light.primaryDark,
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
