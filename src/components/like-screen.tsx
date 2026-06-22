import { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'HOME', image: require('../../assets/images/nav/home.png'), w: 32, h: 32 },
  { id: 'look', label: 'LOOK', image: require('../../assets/images/nav/look.png'), w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like', label: 'LIKE', image: require('../../assets/images/nav/like.png'), w: 27, h: 23 },
  { id: 'my', label: 'MY', image: require('../../assets/images/nav/my.png'), w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

type LikeReview = {
  id: string;
  restaurantName: string;
  address: string;
  reviewerName: string;
  reviews: number;
  followers: number;
  following: number;
  rating: number;
  timeAgo: string;
  summary: string;
  reviewText: string;
  photos: any[];
  isLiked: boolean;
  isFollowing: boolean;
};

const LIKED_REVIEWS: LikeReview[] = [
  {
    id: 'ansung',
    restaurantName: '안서동야곱집',
    address: '충남 천안시 동남구 중앙샛길 2',
    reviewerName: '영재',
    reviews: 29,
    followers: 31,
    following: 18,
    rating: 4,
    timeAgo: '2일 전',
    summary: '야곱이랑 볶음밥 조합이 괜찮았고, 매장 분위기도 깔끔했어요.',
    reviewText:
      '데리야끼 막창이랑 야곱에 볶음밥 시켰는데, 둘이 먹기 아주 충분했습니다. 가격도 저렴하고 양도 많고 맛있었어요. 방학 시즌이라 학생이 많지 않아서 더 쾌적하게 먹고 왔어요.',
    photos: [
      require('../../assets/images/restaurant-yagob-1.png'),
      require('../../assets/images/restaurant-yagob-2.png'),
      require('../../assets/images/restaurant-yagob-3.png'),
    ],
    isLiked: true,
    isFollowing: false,
  },
  {
    id: 'cheonho',
    restaurantName: '천호지',
    address: '충남 천안시 동남구 안서동 526-1',
    reviewerName: '아한종환',
    reviews: 29,
    followers: 31,
    following: 18,
    rating: 4,
    timeAgo: '2일 전',
    summary: '산책하다가 들른 곳인데, 사진보다 실제 분위기가 더 좋았어요.',
    reviewText:
      '해 질 무렵 풍경이 예뻐서 사진 찍기 좋았고, 근처 동선도 편했습니다. 조용히 걷다가 후기 남기기 좋은 장소였어요. 다음에는 밤 산책 코스로 다시 와보려 합니다.',
    photos: [
      require('../../assets/images/banner-sangmyung.png'),
      require('../../assets/images/banner-homigot.png'),
      require('../../assets/images/banner-hollick.png'),
    ],
    isLiked: true,
    isFollowing: false,
  }
];

interface LikeScreenProps {
  onHomePress?: () => void;
  onLookPress?: () => void;
  onWritePress?: () => void;
  onLikePress?: () => void;
  onMyPress?: () => void;
}

export default function LikeScreen({ onHomePress, onLookPress, onWritePress, onLikePress, onMyPress }: LikeScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 28;
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<NavTabId>('like');
  const [reviews, setReviews] = useState<LikeReview[]>(LIKED_REVIEWS);
  const [actionSheetReviewId, setActionSheetReviewId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const likedReviews = reviews.filter((item) => item.isLiked);
    if (!query) return likedReviews;

    return likedReviews.filter((item) => {
      const haystack = [
        item.restaurantName,
        item.address,
        item.reviewerName,
        item.summary,
        item.reviewText,
      ].join(' ').toLowerCase();

      return haystack.includes(query);
    });
  }, [reviews, searchText]);

  const activeReview = useMemo(
    () => reviews.find((item) => item.id === actionSheetReviewId) ?? null,
    [actionSheetReviewId, reviews]
  );

  const closeActionSheet = () => {
    setActionSheetReviewId(null);
  };

  const toggleLikeFromSheet = () => {
    if (!activeReview) return;

    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        item.id === activeReview.id
          ? { ...item, isLiked: !item.isLiked }
          : item
      )
    );

    if (activeReview.isLiked) {
      closeActionSheet();
    }
  };

  const toggleFollowFromSheet = () => {
    if (!activeReview) return;

    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        item.id === activeReview.id
          ? { ...item, isFollowing: !item.isFollowing }
          : item
      )
    );
  };

  const handleTabPress = (tabId: NavTabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') onHomePress?.();
    if (tabId === 'look') onLookPress?.();
    if (tabId === 'write') onWritePress?.();
    if (tabId === 'like') onLikePress?.();
    if (tabId === 'my') onMyPress?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIconText}>✎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="찾는 후기를 검색해주세요"
            placeholderTextColor="#8B8B8B"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Text style={styles.searchIconText}>⌕</Text>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Text style={styles.filterText}>필터 ▾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Text style={styles.filterText}>정렬 ▾</Text>
          </TouchableOpacity>
          <Text style={styles.resultText}>결과 {filteredReviews.length}개</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>좋아요를 누른 후기 모아봤어요</Text>

        {filteredReviews.length > 0 ? (
          filteredReviews.map((item) => {
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardTopTextBlock}>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton} activeOpacity={0.7} onPress={() => setActionSheetReviewId(item.id)}>
                    <Text style={styles.moreButtonText}>•••</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.reviewHeader}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{item.reviewerName[0]}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.reviewerName}</Text>
                    <Text style={styles.userStats}>
                      리뷰 {item.reviews} • 팔로워 {item.followers} • 팔로잉 {item.following}
                    </Text>
                    <View style={styles.ratingRow}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Text
                          key={index}
                          style={[styles.starIcon, index < item.rating ? styles.starFilled : styles.starEmpty]}
                        >
                          ★
                        </Text>
                      ))}
                      <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.expandedBlock}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                    {item.photos.map((photo, index) => (
                      <Image
                        key={index}
                        source={photo}
                        style={[styles.photo, index === 0 && styles.photoFirst]}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                  <Text style={styles.reviewText}>{item.reviewText}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
            <Text style={styles.emptyText}>다른 키워드로 다시 찾아보세요.</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity key={tab.id} style={styles.navItem} onPress={() => handleTabPress(tab.id)} activeOpacity={0.7}>
              <View style={[styles.navTabInner, activeTab === tab.id && styles.navTabInnerActive, tab.pb ? { paddingBottom: tab.pb } : null]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={!!activeReview}
        statusBarTranslucent
        onRequestClose={closeActionSheet}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeActionSheet}>
          <Pressable style={styles.sheet} onPress={() => null}>
            <View style={styles.sheetHandle} />
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={toggleLikeFromSheet}>
                <Text style={[styles.actionIcon, activeReview?.isLiked && styles.actionIconLiked]}>
                  {activeReview?.isLiked ? '♥' : '♡'}
                </Text>
                <Text style={styles.actionLabel}>{activeReview?.isLiked ? '좋아요' : '좋아요'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, activeReview?.isFollowing && styles.actionCardFollowing]}
                activeOpacity={0.8}
                onPress={toggleFollowFromSheet}
              >
                <Text style={styles.actionIcon}>👥</Text>
                <Text style={styles.actionLabel}>{activeReview?.isFollowing ? '팔로잉' : '팔로우'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={closeActionSheet}>
                <Text style={styles.actionIcon}>↗</Text>
                <Text style={styles.actionLabel}>공유</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.reportButton} activeOpacity={0.8} onPress={closeActionSheet}>
              <Text style={styles.reportIcon}>⚠</Text>
              <Text style={styles.reportText}>신고</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    gap: 8,
  },
  searchIconText: {
    fontSize: 16,
    color: '#545454',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000000',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#202020',
  },
  resultText: {
    marginLeft: 'auto',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#4A4A4A',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  cardTopTextBlock: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  address: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: 'Inter',
    color: '#5D5D5D',
  },
  moreButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  moreButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    color: '#8B8B8B',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#000000',
  },
  userStats: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Inter',
    color: '#7A7A7A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 1,
  },
  starIcon: {
    fontSize: 13,
    marginRight: 1,
  },
  starFilled: {
    color: '#F6B400',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  timeAgo: {
    marginLeft: 4,
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#8B8B8B',
  },
  expandedBlock: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  photoRow: {
    gap: 8,
    paddingVertical: 2,
  },
  photo: {
    width: (SCREEN_WIDTH - 15 * 2 - 12 * 2 - 16) / 3,
    height: 118,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
  },
  photoFirst: {
    marginLeft: 0,
  },
  reviewText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Inter',
    color: '#2B2B2B',
  },
  emptyState: {
    marginTop: 28,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#000000',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: 'Inter',
    color: '#666666',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9E9E9E',
    alignSelf: 'center',
    marginBottom: 22,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    minHeight: 150,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  actionCardFollowing: {
    backgroundColor: '#77E945',
  },
  actionIcon: {
    fontSize: 54,
    lineHeight: 60,
    color: '#111111',
    marginBottom: 10,
  },
  actionIconLiked: {
    color: '#E74A41',
  },
  actionLabel: {
    fontSize: 19,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#000000',
  },
  reportButton: {
    marginTop: 18,
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    gap: 10,
  },
  reportIcon: {
    fontSize: 22,
    color: '#FF2A23',
  },
  reportText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#FF2A23',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    fontFamily: 'Inter',
    fontWeight: '300',
    color: '#111111',
  },
  navLabelActive: {
    fontWeight: '300',
  },
});