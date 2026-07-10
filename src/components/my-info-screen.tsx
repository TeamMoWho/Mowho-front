import { SymbolView } from 'expo-symbols';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

interface MockAccount {
  nickname: string;
  username: string;
  passwordMask: string;
  email: string;
  phone: string;
}

interface InfoItem {
  id: string;
  label: string;
  value: string;
  editable?: boolean;
}

const MOCK_ACCOUNT: MockAccount = {
  nickname: '안서동보안관광종',
  username: 'mowho123',
  passwordMask: '**********',
  email: 'mowho123@naver.com',
  phone: '011-1111-1111',
};

const INFO_ITEMS: InfoItem[] = [
  { id: 'nickname', label: '닉네임', value: MOCK_ACCOUNT.nickname, editable: true },
  { id: 'username', label: '아이디', value: MOCK_ACCOUNT.username },
  { id: 'password', label: '비밀번호', value: MOCK_ACCOUNT.passwordMask, editable: true },
  { id: 'email', label: '이메일', value: MOCK_ACCOUNT.email },
  { id: 'phone', label: '전화번호', value: MOCK_ACCOUNT.phone },
];

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'HOME', image: require('../../assets/images/nav/home.png'), w: 32, h: 32 },
  { id: 'look', label: 'LOOK', image: require('../../assets/images/nav/look.png'), w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like', label: 'LIKE', image: require('../../assets/images/nav/like.png'), w: 27, h: 23 },
  { id: 'my', label: 'MY', image: require('../../assets/images/nav/my.png'), w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

interface MyInfoScreenProps {
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
  onBack?: () => void;
  onPasswordPress?: () => void;
}

export default function MyInfoScreen({
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onMyPress,
  onBack,
  onPasswordPress,
}: MyInfoScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 42;

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>내 정보</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
          <TouchableOpacity style={styles.avatarEditButton} activeOpacity={0.7}>
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={18}
              tintColor="#000000"
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          {INFO_ITEMS.map((item) =>
            item.id === 'password' ? (
              <TouchableOpacity
                key={item.id}
                style={styles.infoRow}
                onPress={onPasswordPress}
                activeOpacity={0.7}
              >
                <Text style={styles.infoLabel}>{item.label}</Text>

                <View style={styles.infoValueRow}>
                  <Text style={styles.infoValue}>{item.value}</Text>
                  <View style={styles.inlineEditIcon}>
                    <SymbolView
                      name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                      size={18}
                      tintColor="#000000"
                      weight="bold"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View key={item.id} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>

                <View style={styles.infoValueRow}>
                  <Text style={styles.infoValue}>{item.value}</Text>
                  {item.editable && (
                    <View style={styles.inlineEditIcon}>
                      <SymbolView
                        name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                        size={18}
                        tintColor="#000000"
                        weight="bold"
                      />
                    </View>
                  )}
                </View>
              </View>
            )
          )}
        </View>
      </ScrollView>

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
    paddingHorizontal: 24,
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
  avatarSection: {
    alignSelf: 'center',
    marginTop: 34,
    marginBottom: 34,
  },
  avatarPlaceholder: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: '#EFECE8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingTop: 15,
  },
  avatarHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#BEB9B2',
  },
  avatarBody: {
    width: 70,
    height: 42,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#BEB9B2',
    marginTop: 9,
  },
  avatarEditButton: {
    position: 'absolute',
    right: -2,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6D6D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    width: SCREEN_WIDTH - 48,
    alignSelf: 'center',
  },
  infoRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    paddingHorizontal: 6,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 21,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '68%',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#5F5F5F',
    lineHeight: 20,
    textAlign: 'right',
  },
  inlineEditIcon: {
    marginLeft: 12,
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
