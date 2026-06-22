import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES_ROW1 = [
  { id: 'restaurant', label: '식당',     image: require('../../assets/images/categories/restaurant.png') },
  { id: 'cafe',       label: '카페',     image: require('../../assets/images/categories/cafe.png') },
  { id: 'movie',      label: '영화/OTT', image: require('../../assets/images/categories/movie.png') },
  { id: 'stay',       label: '숙박',     image: require('../../assets/images/categories/stay.png') },
  { id: 'cosmetic',   label: '코스메틱', image: require('../../assets/images/categories/cosmetic.png') },
];

const CATEGORIES_ROW2 = [
  { id: 'travel',      label: '여행',    image: require('../../assets/images/categories/travel.png') },
  { id: 'book',        label: '독서',    image: require('../../assets/images/categories/book.png') },
  { id: 'clothes',     label: '옷',      image: require('../../assets/images/categories/clothes.png') },
  { id: 'electronics', label: '가전제품', image: require('../../assets/images/categories/electronics.png') },
  { id: 'etc',         label: '기타',    image: require('../../assets/images/categories/etc.png') },
];

const NAV_TABS = [
  { id: 'home',  label: 'HOME',  image: require('../../assets/images/nav/home.png'),  w: 32, h: 32 },
  { id: 'look',  label: 'LOOK',  image: require('../../assets/images/nav/look.png'),  w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like',  label: 'LIKE',  image: require('../../assets/images/nav/like.png'),  w: 27, h: 23 },
  { id: 'my',    label: 'MY',    image: require('../../assets/images/nav/my.png'),    w: 31, h: 35 },
];

const BANNER_WIDTH = SCREEN_WIDTH - 30;

const BANNERS_DATA = [
  {
    image: require('../../assets/images/banner-sangmyung.png'),
    title: '상명대학교 천안캠퍼스',
    address: '충청남도 천안시 동남구 상명대길 31',
    total: 10,
  },
  {
    image: require('../../assets/images/banner-homigot.png'),
    title: '호미곶 해맞이 광장',
    address: '경북 포항시 남구 호미곶면 대보리',
    total: 10,
  },
  {
    image: require('../../assets/images/banner-hollick.png'),
    title: '제주 훌릭 뮤지엄',
    address: '제주 제주시 애월읍 평화로 2835 제주훌릭뮤지엄',
    total: 10,
  },
];

// 마지막 → 첫 번째 무한 루프용: 첫 번째 배너를 맨 뒤에 복사
const BANNERS = [...BANNERS_DATA, BANNERS_DATA[0]];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

interface MainScreenProps {
  onLogout?: () => void;
  onCategoryPress?: (categoryId: string) => void;
  onLookPress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
}

export default function MainScreen({ onLogout, onCategoryPress, onLookPress, onLikePress, onMyPress }: MainScreenProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerIndexRef = useRef(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setInterval(() => {
      const next = bannerIndexRef.current + 1;
      bannerScrollRef.current?.scrollTo({ x: next * BANNER_WIDTH, animated: true });
      bannerIndexRef.current = next;
      setBannerIndex(next % BANNERS_DATA.length);

      // 복사본(마지막+1)에 도달하면 소리 없이 첫 번째로 점프
      if (next === BANNERS_DATA.length) {
        setTimeout(() => {
          bannerScrollRef.current?.scrollTo({ x: 0, animated: false });
          bannerIndexRef.current = 0;
        }, 400);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    if (index < bannerIndexRef.current) {
      bannerScrollRef.current?.scrollTo({ x: bannerIndexRef.current * BANNER_WIDTH, animated: true });
      return;
    }
    bannerIndexRef.current = index;
    setBannerIndex(index % BANNERS_DATA.length);

    // 복사본(마지막+1)에 도달하면 소리 없이 첫 번째로 점프
    if (index === BANNERS_DATA.length) {
      setTimeout(() => {
        bannerScrollRef.current?.scrollTo({ x: 0, animated: false });
        bannerIndexRef.current = 0;
      }, 400);
    }
  };

  const bottomInset = insets.bottom;
  const navBottom = bottomInset + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 20;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* 검색창 - 고정 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#828282"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 배너 캐러셀 */}
        <View style={styles.bannerWrapper}>
          <View style={styles.bannerShadow}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleBannerScroll}
              ref={bannerScrollRef}
              style={styles.bannerScroll}
            >
              {BANNERS.map((banner, idx) => (
                <View key={idx} style={styles.banner}>
                  <Image source={banner.image} style={styles.bannerImage} resizeMode="cover" />
                  <View style={styles.bannerOverlay}>
                    <View style={styles.outlineWrapper}>
                      {[{top:-1,left:0},{top:1,left:0},{top:0,left:-1},{top:0,left:1}].map((offset, i) => (
                        <Text key={i} style={[styles.bannerTitle, styles.bannerTitleOutline, offset]}>{banner.title}</Text>
                      ))}
                      <Text style={styles.bannerTitle}>{banner.title}</Text>
                    </View>
                    <View style={styles.outlineWrapper}>
                      {[{top:-1,left:0},{top:1,left:0},{top:0,left:-1},{top:0,left:1}].map((offset, i) => (
                        <Text key={i} style={[styles.bannerAddress, styles.bannerAddressOutline, offset]}>{banner.address}</Text>
                      ))}
                      <Text style={styles.bannerAddress}>{banner.address}</Text>
                    </View>
                  </View>
                  <View style={styles.bannerIndicator}>
                    <Text style={styles.bannerIndicatorText}>{(idx % BANNERS_DATA.length) + 1} / {BANNERS_DATA[0].total}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 카테고리 */}
        <View style={styles.categorySection}>
          <View style={styles.categoryRow}>
            {CATEGORIES_ROW1.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7} onPress={() => onCategoryPress?.(cat.id)}>
                <Image source={cat.image} style={styles.categoryIcon} resizeMode="contain" />
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.categoryRow}>
            {CATEGORIES_ROW2.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7} onPress={() => onCategoryPress?.(cat.id)}>
                {(cat as any).image
                  ? <Image source={(cat as any).image} style={styles.categoryIcon} resizeMode="contain" />
                  : <Text style={styles.categoryEmoji}>{(cat as any).emoji}</Text>
                }
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>내 주변에서 핫한 후기에요</Text>
          <View style={styles.mapContainer}>
            {/* 지도 placeholder → 추후 지도 API로 교체 */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderEmoji}>🗺️</Text>
              <Text style={styles.mapPlaceholderLabel}>지도 영역</Text>
            </View>
            {/* 이 지역 검색 버튼 */}
            <TouchableOpacity style={styles.reSearchButton} activeOpacity={0.8}>
              <Text style={styles.reSearchIcon}>🔍</Text>
              <Text style={styles.reSearchText}>이 지역 검색</Text>
            </TouchableOpacity>
          </View>

          {/* 안내 바 */}
          <View style={styles.infoBar}>
            <Text style={styles.infoText}>지도의 아이콘을 클릭하면 관련된 후기가 떠요</Text>
          </View>
        </View>

      </ScrollView>

      {/* 하단 네비게이션 - 절대 위치 고정 */}
      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => {
                setActiveTab(tab.id);
                if (tab.id === 'look') onLookPress?.();
                if (tab.id === 'like') onLikePress?.();
                if (tab.id === 'my') onMyPress?.();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.navTabInner, activeTab === tab.id && styles.navTabInnerActive, (tab as any).pb && { paddingBottom: (tab as any).pb }]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>
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

  /* 검색창 */
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  searchIconText: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(0,0,0,0.9)',
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(0,0,0,0.9)',
    marginLeft: 'auto',
  },

  /* 스크롤 */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },

  /* 배너 */
  bannerWrapper: {
    paddingHorizontal: 15,
  },
  bannerShadow: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  bannerScroll: {
    borderRadius: 20,
  },
  banner: {
    width: BANNER_WIDTH,
    height: 229,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    alignItems: 'flex-start',
  },
  outlineWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bannerTitleOutline: {
    position: 'absolute',
    color: 'rgba(0,0,0,0.8)',
  },
  bannerAddress: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginTop: 4,
  },
  bannerAddressOutline: {
    position: 'absolute',
    color: 'rgba(0,0,0,0.8)',
    marginTop: 4,
  },
  bannerIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 10,
    backgroundColor: 'rgba(217,217,217,0.8)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bannerIndicatorText: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#000',
  },

  /* 카테고리 */
  categorySection: {
    paddingHorizontal: 15,
    marginTop: 20,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 30) / 5,
    paddingVertical: 6,
  },
  categoryIcon: {
    width: 44,
    height: 44,
  },
  categoryEmoji: {
    fontSize: 36,
    width: 44,
    height: 44,
    textAlign: 'center',
    lineHeight: 44,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },

  /* 지도 섹션 */
  mapSection: {
    paddingHorizontal: 15,
    marginTop: 24,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  mapContainer: {
    height: 510,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPlaceholderEmoji: {
    fontSize: 60,
  },
  mapPlaceholderLabel: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Inter',
  },
  reSearchButton: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    left: (SCREEN_WIDTH - 30 - 131) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  reSearchIcon: {
    fontSize: 14,
  },
  reSearchText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: Colors.light.primary,
  },

  /* 안내 바 */
  infoBar: {
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#828282',
    textAlign: 'center',
  },

  /* 홈 인디케이터 */
  homeIndicatorWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#8E8E93',
    borderRadius: 10,
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
    gap: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
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
    marginTop: 0,
  },
  navTabInnerActive: {
    backgroundColor: 'rgba(133, 235, 108, 0.5)',
  },
  navIconBg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 26,
    height: 26,
  },
  navLabel: {
    position: 'absolute',
    bottom: 3,
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'Inter',
    color: '#000',
  },
  navLabelActive: {
    fontWeight: '300',
  },
});
