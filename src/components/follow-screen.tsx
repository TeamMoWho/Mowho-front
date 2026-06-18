import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavTabId = 'home' | 'look' | 'write' | 'like' | 'my';

interface NavTabItem {
  id: NavTabId;
  label: string;
  image: any;
  w: number;
  h: number;
  pb?: number;
}

interface FollowItem {
  id: string;
  name: string;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'HOME', image: require('../../assets/images/nav/home.png'), w: 32, h: 32 },
  { id: 'look', label: 'LOOK', image: require('../../assets/images/nav/look.png'), w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like', label: 'LIKE', image: require('../../assets/images/nav/like.png'), w: 27, h: 23 },
  { id: 'my', label: 'MY', image: require('../../assets/images/nav/my.png'), w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

const INITIAL_FOLLOW_LIST: FollowItem[] = [
  {
    id: 'ahn',
    name: '아한종환',
    reviewCount: 29,
    followerCount: 31,
    followingCount: 18,
    isFollowing: true,
  },
  {
    id: 'yu',
    name: '유다연입니다',
    reviewCount: 2,
    followerCount: 3,
    followingCount: 1,
    isFollowing: false,
  },
];

interface FollowScreenProps {
  onBack?: () => void;
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
}

export default function FollowScreen({
  onBack,
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onMyPress,
}: FollowScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 36;

  const [followList, setFollowList] = useState(INITIAL_FOLLOW_LIST);

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  const handleToggleFollow = (itemId: string) => {
    setFollowList((currentList) =>
      currentList.map((item) => {
        if (item.id !== itemId) return item;

        const nextFollowing = !item.isFollowing;
        return {
          ...item,
          isFollowing: nextFollowing,
          followerCount: Math.max(0, item.followerCount + (nextFollowing ? 1 : -1)),
        };
      })
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.page}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>팔로우</Text>

        <View style={styles.listSection}>
          {followList.map((item, index) => {
            const buttonLabel = item.isFollowing ? '팔로잉' : '팔로우';
            const buttonStyle = item.isFollowing ? styles.followingButton : styles.followButton;
            const buttonTextStyle = item.isFollowing ? styles.followingButtonText : styles.followButtonText;

            return (
              <View key={item.id} style={[styles.row, index === followList.length - 1 && styles.rowLast]}>
                <View style={styles.avatar}>
                  <View style={styles.avatarHead} />
                  <View style={styles.avatarBody} />
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userStats}>
                    리뷰 {item.reviewCount} • 팔로워 {item.followerCount} • 팔로잉 {item.followingCount}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.followButtonBase, buttonStyle]}
                  onPress={() => handleToggleFollow(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={buttonTextStyle}>{buttonLabel}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

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
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, tab.id === 'my' && styles.navLabelActive]}>{tab.label}</Text>
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
  page: {
    flex: 1,
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
  listSection: {
    marginTop: 30,
    paddingHorizontal: 18,
  },
  row: {
    minHeight: 94,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    paddingVertical: 18,
    paddingLeft: 6,
    paddingRight: 6,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4E1DD',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingTop: 6,
  },
  avatarHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#B9B5B0',
  },
  avatarBody: {
    width: 24,
    height: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#B9B5B0',
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 22,
  },
  userStats: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#8C8C8C',
    lineHeight: 16,
  },
  followButtonBase: {
    minWidth: 58,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  followButton: {
    backgroundColor: '#5CE11B',
  },
  followingButton: {
    backgroundColor: '#E7E7E7',
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  followingButtonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 16,
  },
  navWrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
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
  navItem: { alignItems: 'center', justifyContent: 'center' },
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
  navTabInnerActive: { backgroundColor: 'rgba(133, 235, 108, 0.5)' },
  navIconBg: { alignItems: 'center', justifyContent: 'center' },
  navLabel: {
    position: 'absolute',
    bottom: 3,
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'Inter',
    color: '#000000',
  },
  navLabelActive: { fontWeight: '300' },
});