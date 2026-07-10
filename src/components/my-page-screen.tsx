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

interface MockUser {
  nickname: string;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  profileImageUri?: string;
}

interface MenuItem {
  id: string;
  label: string;
}

interface NavTabItem {
  id: NavTabId;
  label: string;
  image: any;
  w: number;
  h: number;
  pb?: number;
}

const MOCK_USER: MockUser = {
  nickname: '안서동보안관광종',
  reviewCount: 29,
  followerCount: 31,
  followingCount: 18,
  profileImageUri: '',
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'my-info', label: '내 정보' },
  { id: 'follow', label: '팔로우' },
  { id: 'notification', label: '알림' },
  { id: 'support', label: '고객센터' },
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

interface MyPageScreenProps {
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onBellPress?: () => void;
  onSettingsPress?: () => void;
  onMenuPress?: (menuId: string) => void;
}

export default function MyPageScreen({
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onBellPress,
  onSettingsPress,
  onMenuPress,
}: MyPageScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 28;

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onBellPress}
          activeOpacity={0.7}
        >
          <SymbolView
            name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
            size={25}
            tintColor="#000000"
            weight="medium"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <SymbolView
            name={{ ios: 'gearshape', android: 'settings', web: 'settings' }}
            size={25}
            tintColor="#000000"
            weight="medium"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          {MOCK_USER.profileImageUri ? (
            <Image source={{ uri: MOCK_USER.profileImageUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>
          )}

          <View style={styles.profileInfo}>
            <View style={styles.nicknameRow}>
              <Text style={styles.nicknameLabel}>닉네임</Text>
              <Text style={styles.nicknameValue}>{MOCK_USER.nickname}</Text>
            </View>
            <Text style={styles.userStats}>
              리뷰 {MOCK_USER.reviewCount} • 팔로워 {MOCK_USER.followerCount} • 팔로잉 {MOCK_USER.followingCount}
            </Text>
          </View>
        </View>

        {/* 메뉴 리스트 */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => onMenuPress?.(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={16}
                tintColor="#C8C8C8"
                weight="regular"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
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

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 스크롤 */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 26,
  },

  /* 프로필 카드 */
  profileCard: {
    width: SCREEN_WIDTH - 30,
    minHeight: 118,
    backgroundColor: '#F5F5F5',
    alignSelf: 'center',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E4E4E4',
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ECE9E5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingTop: 10,
  },
  avatarHead: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#BEB9B2',
  },
  avatarBody: {
    width: 54,
    height: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#BEB9B2',
    marginTop: 6,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  nicknameLabel: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#9D9D9D',
    lineHeight: 20,
  },
  nicknameValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  userStats: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    color: '#8A8A8A',
    lineHeight: 16,
  },

  /* 메뉴 */
  menuSection: {
    marginTop: 42,
  },
  menuItem: {
    minHeight: 69,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 21,
  },

  /* 하단 네비게이션 */
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
