import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_TABS = [
  { id: 'home',  label: 'HOME',  image: require('../../assets/images/nav/home.png'),  w: 32, h: 32 },
  { id: 'look',  label: 'LOOK',  image: require('../../assets/images/nav/look.png'),  w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like',  label: 'LIKE',  image: require('../../assets/images/nav/like.png'),  w: 27, h: 23 },
  { id: 'my',    label: 'MY',    image: require('../../assets/images/nav/my.png'),    w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

const BANNERS_DETAIL = [
  {
    image: require('../../assets/images/banner-sangmyung.png'),
    title: '상명대학교 천안캠퍼스',
    address: '충청남도 천안시 동남구 상명대길 31',
  },
  {
    image: require('../../assets/images/banner-homigot.png'),
    title: '호미곶 해맞이 광장',
    address: '경북 포항시 남구 호미곶면 대보리',
  },
  {
    image: require('../../assets/images/banner-hollick.png'),
    title: '제주 훌릭 뮤지엄',
    address: '제주 제주시 애월읍 평화로 2835 제주훌릭뮤지엄',
  },
];

const SKELETON_CARD_COUNT = 3;

interface BannerDetailScreenProps {
  bannerIndex: number;
  onNavigate?: (tabId: string) => void;
}

export default function BannerDetailScreen({ bannerIndex, onNavigate }: BannerDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 20;
  const banner = BANNERS_DETAIL[bannerIndex] ?? BANNERS_DETAIL[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate?.('home')} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{banner.title}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 히어로 이미지 */}
        <View style={styles.heroWrapper}>
          <Image source={banner.image} style={styles.heroImage} resizeMode="cover" />
        </View>

        {/* 장소 정보 */}
        <View style={styles.placeInfo}>
          <Text style={styles.placeTitle}>{banner.title}</Text>
          <Text style={styles.placeAddress}>{banner.address}</Text>
        </View>

        <View style={styles.dividerBlock} />

        {/* 후기 카드 목록 — look-screen 프로토타입 스타일 */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>이 장소의 후기</Text>

          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <View key={i} style={[styles.card, styles.cardEmpty]}>

              {/* 상단: 장소명 스켈레톤 + 액션 */}
              <View style={styles.cardTop}>
                <View style={styles.skeletonName} />
                <View style={styles.cardActions}>
                  <Image source={require('../../assets/images/icon-heart.png')} style={styles.actionIcon} resizeMode="contain" />
                  <Text style={styles.moreIcon}>•••</Text>
                </View>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 유저 프로필 스켈레톤 */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircleSkeleton} />
                <View>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, { width: 120, marginTop: 4 }]} />
                </View>
              </View>

              {/* 별점 스켈레톤 */}
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <Text key={si} style={[styles.starIcon, styles.starEmpty]}>★</Text>
                ))}
              </View>

              {/* 사진 플레이스홀더 */}
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>사진</Text>
              </View>

              {/* 텍스트 스켈레톤 */}
              <View style={[styles.skeletonLine, { width: '90%', marginHorizontal: 12, marginTop: 10 }]} />
              <View style={[styles.skeletonLine, { width: '70%', marginHorizontal: 12, marginTop: 6, marginBottom: 12 }]} />

            </View>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity key={tab.id} style={styles.navItem} activeOpacity={0.7} onPress={() => onNavigate?.(tab.id)}>
              <View style={[
                styles.navTabInner,
                tab.id === 'home' && styles.navTabInnerActive,
                (tab as any).pb ? { paddingBottom: (tab as any).pb } : null,
              ]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, tab.id === 'home' && styles.navLabelActive]}>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  backButton: { padding: 4 },
  backArrow: { fontSize: 22, fontWeight: '600', color: '#000', fontFamily: 'Inter-SemiBold' },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
  },

  /* 스크롤 */
  scroll: { flex: 1 },
  scrollContent: {},

  /* 히어로 이미지 */
  heroWrapper: { width: '100%', height: 220 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 12, left: 12 },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroAddress: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#FFF',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* 장소 정보 */
  placeInfo: {
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 4,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  placeAddress: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#828282',
  },

  /* 구분 블록 */
  dividerBlock: { height: 8, backgroundColor: '#F5F5F5' },

  /* 후기 섹션 */
  reviewSection: { paddingHorizontal: 15, paddingTop: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
    lineHeight: 28,
    marginBottom: 12,
  },

  /* 카드 (look-screen 동일) */
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 12,
    marginBottom: 16,
  },
  cardEmpty: { borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed' },

  /* 카드 상단 */
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { width: 24, height: 24 },
  moreIcon: { fontSize: 13, color: '#555', letterSpacing: 1 },

  /* 구분선 */
  divider: { height: 1, backgroundColor: '#5C5C5C', marginBottom: 10 },

  /* 유저 프로필 */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  avatarCircleSkeleton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D0D0D0' },

  /* 별점 */
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 10,
  },
  starIcon: { fontSize: 12, lineHeight: 14 },
  starEmpty: { color: '#D0D0D0' },

  /* 사진 플레이스홀더 */
  photoPlaceholder: {
    height: 151,
    marginHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 13, color: '#888' },

  /* 스켈레톤 */
  skeletonName: { width: 100, height: 18, borderRadius: 4, backgroundColor: '#D0D0D0', marginBottom: 4 },
  skeletonLine: { height: 10, borderRadius: 4, backgroundColor: '#D0D0D0', width: 200 },

  /* 네비게이션 */
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
  navLabel: { position: 'absolute', bottom: 3, fontSize: 10, fontWeight: '300', fontFamily: 'Inter', color: '#000' },
  navLabelActive: { fontWeight: '300' },
});
