import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
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

const REVIEWS = [
  {
    id: '1',
    user: { name: '영재', reviews: 29, followers: 31, following: 18 },
    rating: 4,
    timeAgo: '5시간 전',
    photos: [
      require('../../assets/images/restaurant-yagob-1.png'),
      require('../../assets/images/restaurant-yagob-2.png'),
      require('../../assets/images/restaurant-yagob-3.png'),
    ],
    review: '데리야끼 막창이랑 야곱에 볶음밥 시켰는데, 둘이 먹기 아주 충분했습니다! 가격도 저렴하고, 양도 많고, 맛있어요. 방학 시즌이라 학생들이 많지 않아서 쾌적하게 먹고 왔어요 ㅎㅎ 또 방문하겠습니다:)',
    liked: false,
  },
];

interface RestaurantScreenProps {
  onBack?: () => void;
  onHomePress?: () => void;
  onLookPress?: () => void;
  onMyPress?: () => void;
}

export default function RestaurantScreen({ onBack, onHomePress, onLookPress, onMyPress }: RestaurantScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 20;
  const [liked, setLiked] = useState<Record<string, boolean>>(
    Object.fromEntries(REVIEWS.map(r => [r.id, r.liked]))
  );
  const [searchText, setSearchText] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="맛있는 로기를 검색해보세요"
            placeholderTextColor="#828282"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 + 필터 */}
        <View style={styles.titleBlock}>
          <Image source={require('../../assets/images/icon-restaurant-category.png')} style={styles.titleIcon} resizeMode="contain" />
          <View style={styles.titleTextBlock}>
            <Text style={styles.titleText}>식당 카테고리를 추천드려요</Text>
            <Text style={styles.titleSub}>사용자의 위치에 따라 AI가 추천해요</Text>
          </View>
        </View>
        {/* 실시간 추천 섹션 */}
        <Text style={styles.sectionTitle}>실시간 추천</Text>

        {REVIEWS.map((item) => (
          <View key={item.id} style={styles.card}>

            {/* 카드 헤더: 프로필 + 공유/더보기 */}
            <View style={styles.cardHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.user.name[0]}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.user.name}</Text>
                <Text style={styles.userStats}>
                  리뷰 {item.user.reviews} • 팔로워 {item.user.followers} • 팔로잉 {item.user.following}
                </Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Image source={require('../../assets/images/icon-heart.png')} style={styles.iconBtnImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Text style={styles.iconBtnTextMore}>•••</Text>
              </TouchableOpacity>
            </View>

            {/* 별점 + 시간 */}
            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text key={i} style={[styles.starIcon, i < item.rating ? styles.starFilled : styles.starEmpty]}>★</Text>
              ))}
              <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            </View>

            {/* 사진 가로 스크롤 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroll}
              contentContainerStyle={styles.photoScrollContent}
            >
              {item.photos.map((photo, idx) => (
                <Image
                  key={idx}
                  source={photo}
                  style={[styles.photo, idx === 0 && styles.photoFirst]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* 리뷰 텍스트 */}
            <Text style={styles.reviewText}>{item.review}</Text>

            {/* 좋아요 */}
            <TouchableOpacity
              style={styles.likeRow}
              onPress={() => setLiked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
              activeOpacity={0.7}
            >
              <Text style={[styles.likeIcon, liked[item.id] && styles.likeIconActive]}>
                {liked[item.id] ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>

          </View>
        ))}
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => {
                if (tab.id === 'home') {
                  if (onHomePress) onHomePress();
                  else onBack?.();
                }
                if (tab.id === 'look') onLookPress?.();
                if (tab.id === 'my') onMyPress?.();
              }}
            >
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
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter', color: '#000' },

  /* 스크롤 */
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingHorizontal: 15 },

  /* 타이틀 */
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 14,
  },
  titleIcon: {
    width: 44,
    height: 44,
  },
  titleTextBlock: {
    paddingTop: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 25,
  },
  titleSub: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#595959',
    lineHeight: 14,
  },

  /* 필터 */
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  filterChipText: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter', color: '#000' },

  /* 섹션 타이틀 */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },

  /* 소셜 리뷰 카드 */
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },

  /* 카드 헤더 */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter-Bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000', lineHeight: 21 },
  userStats: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#828282', lineHeight: 14 },
  iconBtn: { padding: 4 },
  iconBtnImage: { width: 24, height: 24 },
  iconBtnTextMore: { fontSize: 13, color: '#555', letterSpacing: 1 },

  /* 별점 + 시간 */
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 10,
  },
  starIcon: {
    fontSize: 12,
    lineHeight: 14,
  },
  starFilled: { color: '#FFD700' },
  starEmpty: { color: '#D0D0D0' },
  timeAgo: {
    fontSize: 8,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#828282',
    marginLeft: 4,
    lineHeight: 11,
  },

  /* 사진 */
  photoScroll: { marginBottom: 10 },
  photoScrollContent: { paddingHorizontal: 12, gap: 6 },
  photo: { width: 151, height: 151, borderRadius: 6 },
  photoFirst: { width: 121 },

  /* 리뷰 텍스트 */
  reviewText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000',
    lineHeight: 17,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  /* 좋아요 */
  likeRow: { paddingHorizontal: 12, alignSelf: 'flex-start' },
  likeIcon: { fontSize: 20, color: '#ccc' },
  likeIconActive: { color: '#FF3B30' },

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
