import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Switch,
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

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'HOME', image: require('../../assets/images/nav/home.png'), w: 32, h: 32 },
  { id: 'look', label: 'LOOK', image: require('../../assets/images/nav/look.png'), w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like', label: 'LIKE', image: require('../../assets/images/nav/like.png'), w: 27, h: 23 },
  { id: 'my', label: 'MY', image: require('../../assets/images/nav/my.png'), w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

interface NotificationScreenProps {
  onBack?: () => void;
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
}

interface NotificationRow {
  id: 'recommend' | 'follow' | 'like';
  title: string;
  description: string;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    id: 'recommend',
    title: '추천',
    description: '회원님이 고른 카테고리를 추천해주는 알림',
  },
  {
    id: 'follow',
    title: '팔로워',
    description: '상대방이 회원님을 팔로우 할때 알림',
  },
  {
    id: 'like',
    title: '좋아요',
    description: '상대방이 회원님의 게시물을 좋아요 누를때 알림',
  },
];

export default function NotificationScreen({
  onBack,
  onHomePress,
  onLookPress,
  onWritePress,
  onLikePress,
  onMyPress,
}: NotificationScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 44;

  const [appNotificationsDisabled, setAppNotificationsDisabled] = useState(false);
  const [recommendEnabled, setRecommendEnabled] = useState(true);
  const [followEnabled, setFollowEnabled] = useState(true);
  const [likeEnabled, setLikeEnabled] = useState(false);

  useEffect(() => {
    if (appNotificationsDisabled) {
      setRecommendEnabled(false);
      setFollowEnabled(false);
      setLikeEnabled(false);
    }
  }, [appNotificationsDisabled]);

  const handleTabPress = (tabId: NavTabId) => {
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  const toggleAppNotifications = (nextValue: boolean) => {
    setAppNotificationsDisabled(nextValue);
    if (nextValue) {
      setRecommendEnabled(false);
      setFollowEnabled(false);
      setLikeEnabled(false);
    }
  };

  const renderNotificationRow = (
    row: NotificationRow,
    enabled: boolean,
    onChange: (nextValue: boolean) => void,
  ) => {
    const isDisabled = appNotificationsDisabled;

    return (
      <View key={row.id} style={[styles.row, isDisabled && styles.rowDisabled]}>
        <View style={styles.rowTextArea}>
          <Text style={styles.rowTitle}>{row.title}</Text>
          <Text style={styles.rowDescription}>{row.description}</Text>
        </View>

        <Switch
          value={enabled}
          onValueChange={onChange}
          disabled={isDisabled}
          trackColor={{ false: '#D0D0D0', true: '#97EB64' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D0D0D0"
          style={styles.switch}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.page}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>알림</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowTextArea}>
              <Text style={styles.rowTitle}>앱 알림 끄기</Text>
            </View>

            <Switch
              value={appNotificationsDisabled}
              onValueChange={toggleAppNotifications}
              trackColor={{ false: '#D0D0D0', true: '#97EB64' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D0D0D0"
              style={styles.switch}
            />
          </View>

          {renderNotificationRow(
            NOTIFICATION_ROWS[0],
            recommendEnabled,
            (nextValue) => setRecommendEnabled(nextValue)
          )}
          {renderNotificationRow(
            NOTIFICATION_ROWS[1],
            followEnabled,
            (nextValue) => setFollowEnabled(nextValue)
          )}
          {renderNotificationRow(NOTIFICATION_ROWS[2], likeEnabled, (nextValue) => setLikeEnabled(nextValue))}
        </View>

        <View style={styles.footerHintArea}>
          <Text style={[styles.footerHint, appNotificationsDisabled && styles.footerHintActive]}>
            하위 항목은 앱 알림이 켜져 있을 때만 개별 설정할 수 있습니다.
          </Text>
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
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  row: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  rowDisabled: {
    opacity: 0.58,
  },
  rowTextArea: {
    flex: 1,
    paddingRight: 18,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 21,
  },
  rowDescription: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#A2A2A2',
    lineHeight: 16,
  },
  switch: {
    transform: [{ scaleX: 1.05 }, { scaleY: 1.05 }],
  },
  footerHintArea: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  footerHint: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#B0B0B0',
    lineHeight: 18,
  },
  footerHintActive: {
    color: '#8A8A8A',
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