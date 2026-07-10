import { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavTabId = 'home' | 'look' | 'write' | 'like' | 'my';

interface NavTabItem {
  id: NavTabId;
  label: string;
  image: any;
  w: number;
  h: number;
  pb?: number;
}

const MOCK_PASSWORD = 'mowho12345';

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'HOME', image: require('../../assets/images/nav/home.png'), w: 32, h: 32 },
  { id: 'look', label: 'LOOK', image: require('../../assets/images/nav/look.png'), w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like', label: 'LIKE', image: require('../../assets/images/nav/like.png'), w: 27, h: 23 },
  { id: 'my', label: 'MY', image: require('../../assets/images/nav/my.png'), w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

interface PasswordChangeScreenProps {
  onBack?: () => void;
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
}

export default function PasswordChangeScreen({
  onBack,
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onMyPress,
}: PasswordChangeScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 36;

  const [currentPassword, setCurrentPassword] = useState(MOCK_PASSWORD);
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isConfirmFilled = passwordConfirm.length > 0;
  const passwordsMatch = newPassword.length > 0 && newPassword === passwordConfirm;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    passwordConfirm.length > 0 &&
    passwordsMatch;

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  const handleChangePassword = () => {
    if (!canSubmit) {
      setShowSuccess(false);
      return;
    }
    setShowSuccess(true);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setShowSuccess(false);
  };

  const handlePasswordConfirmChange = (text: string) => {
    setPasswordConfirm(text);
    setShowSuccess(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>비밀번호 변경</Text>

        <View style={styles.formSection}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>현재 비밀번호</Text>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setShowSuccess(false);
              }}
              secureTextEntry
              autoCapitalize="none"
              textAlign="right"
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>새 비밀번호</Text>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              secureTextEntry
              autoCapitalize="none"
              textAlign="right"
            />
          </View>

          <View style={[styles.formRow, styles.formRowLast]}>
            <Text style={styles.formLabel}>비밀번호 확인</Text>
            <View style={styles.confirmFieldArea}>
              <TextInput
                style={styles.passwordInput}
                value={passwordConfirm}
                onChangeText={handlePasswordConfirmChange}
                secureTextEntry
                autoCapitalize="none"
                textAlign="right"
              />
              {isConfirmFilled && passwordsMatch && (
                <Text style={styles.helperTextMatch}>비밀번호가 맞습니다</Text>
              )}
              {isConfirmFilled && !passwordsMatch && (
                <Text style={styles.helperTextError}>비밀번호가 틀립니다</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.bottomActionArea}>
          {showSuccess && (
            <View style={styles.successToast}>
              <Text style={styles.successToastText}>변경되었습니다</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.changeButton, canSubmit && styles.changeButtonActive]}
            onPress={handleChangePassword}
            activeOpacity={0.8}
          >
            <Text style={styles.changeButtonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.navTabInner,
                  tab.id === 'my' && styles.navTabInnerActive,
                  tab.pb ? { paddingBottom: tab.pb } : null,
                ]}
              >
                <View style={styles.navIconBg}>
                  <Image
                    source={tab.image}
                    style={{ width: tab.w, height: tab.h }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.navLabel, tab.id === 'my' && styles.navLabelActive]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 6,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    lineHeight: 30,
  },
  title: {
    marginTop: 52,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 28,
  },
  formSection: {
    marginTop: 128,
  },
  formRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    paddingHorizontal: 6,
  },
  formRowLast: {
    alignItems: 'flex-start',
    paddingTop: 28,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 21,
  },
  confirmFieldArea: {
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  passwordInput: {
    width: 176,
    height: 30,
    borderWidth: 1,
    borderColor: '#818181',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  helperTextMatch: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#8F8F8F',
    lineHeight: 14,
  },
  helperTextError: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    color: '#FF3333',
    lineHeight: 14,
  },
  bottomActionArea: {
    marginTop: 'auto',
    paddingTop: 26,
  },
  successToast: {
    width: SCREEN_WIDTH - 112,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 18,
  },
  successToastText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    lineHeight: 22,
  },
  changeButton: {
    width: SCREEN_WIDTH - 48,
    alignSelf: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#84EB68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButtonActive: {
    backgroundColor: '#176C09',
  },
  changeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 22,
  },
  navWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBar: {
    width: 325,
    height: NAV_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#51E92B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabInner: {
    width: 60,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 15,
    marginHorizontal: -0.2,
  },
  navTabInnerActive: {
    backgroundColor: 'rgba(133, 235, 108, 0.5)',
  },
  navIconBg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    position: 'absolute',
    bottom: 3,
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'Inter',
    color: '#000000',
  },
  navLabelActive: {
    fontWeight: '300',
  },
});
