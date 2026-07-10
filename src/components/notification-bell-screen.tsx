import { useState } from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

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

interface NotificationBellScreenProps {
  onBack?: () => void;
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
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

const NOTIFICATION_ITEMS = [
  {
    id: 'like',
    type: 'like',
    name: '아한종환',
    message: '님께서\n회원님의 후기에 좋아요를 눌렀습니다',
    thumbnail: require('../../assets/images/restaurant-yagob-2.png'),
  },
  {
    id: 'follow',
    type: 'follow',
    name: '아한종환',
    message: '님께서\n회원님을 팔로우 하셨습니다',
    actionLabel: '팔로우',
  },
  {
    id: 'report',
    type: 'report',
    title: '누적된 신고로',
    message: '회원님의 후기가 삭제되었습니다',
  },
];

export default function NotificationBellScreen({
  onBack,
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onMyPress,
}: NotificationBellScreenProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 38;

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>MoWho 알림</Text>

        <View style={styles.listSection}>
          <View style={styles.likeRow}>
            <View style={styles.leftUserArea}>
              <View style={styles.avatar}>
                <View style={styles.avatarHead} />
                <View style={styles.avatarBody} />
              </View>

              <View style={styles.textArea}>
                <Text style={styles.messageLine}>
                  <Text style={styles.name}>{NOTIFICATION_ITEMS[0].name}</Text>
                  {NOTIFICATION_ITEMS[0].message}
                </Text>
              </View>
            </View>

            <Image source={NOTIFICATION_ITEMS[0].thumbnail} style={styles.thumbnail} resizeMode="cover" />
          </View>

          <View style={styles.followRow}>
            <View style={styles.leftUserArea}>
              <View style={styles.avatar}>
                <View style={styles.avatarHead} />
                <View style={styles.avatarBody} />
              </View>

              <View style={styles.textArea}>
                <Text style={styles.messageLine}>
                  <Text style={styles.name}>{NOTIFICATION_ITEMS[1].name}</Text>
                  {NOTIFICATION_ITEMS[1].message}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.followBadge, isFollowing && styles.followBadgeFollowing]}
              onPress={() => setIsFollowing((current) => !current)}
              activeOpacity={0.8}
            >
              <Text style={[styles.followBadgeText, isFollowing && styles.followBadgeTextFollowing]}>
                {isFollowing ? '팔로잉' : NOTIFICATION_ITEMS[1].actionLabel}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.reportRow} activeOpacity={0.7}>
            <View style={styles.reportTextArea}>
              <Text style={styles.reportTitle}>{NOTIFICATION_ITEMS[2].title}</Text>
              <Text style={styles.reportMessage}>{NOTIFICATION_ITEMS[2].message}</Text>
            </View>

            <Text style={styles.reportChevron}>›</Text>
          </TouchableOpacity>
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
  content: {
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
    marginTop: 48,
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 29,
  },
  listSection: {
    marginTop: 52,
    paddingHorizontal: 20,
  },
  likeRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    paddingVertical: 12,
    paddingRight: 6,
  },
  followRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    paddingVertical: 12,
    paddingRight: 6,
  },
  leftUserArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E6E1DC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingTop: 5,
  },
  avatarHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C0BBB6',
  },
  avatarBody: {
    width: 21,
    height: 13,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#C0BBB6',
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    marginLeft: 10,
  },
  messageLine: {
    fontSize: 12.5,
    fontFamily: 'Inter',
    color: '#7B7B7B',
    lineHeight: 18,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  followBadge: {
    minWidth: 44,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#6BE12D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  followBadgeFollowing: {
    backgroundColor: '#EDEDED',
  },
  followBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 14,
  },
  followBadgeTextFollowing: {
    color: '#6D6D6D',
  },
  reportRow: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    paddingVertical: 14,
    paddingRight: 10,
  },
  reportTextArea: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 22,
  },
  reportMessage: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 20,
  },
  reportChevron: {
    fontSize: 34,
    color: '#C9C9C9',
    lineHeight: 34,
    marginLeft: 12,
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