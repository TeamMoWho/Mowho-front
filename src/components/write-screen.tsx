import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

interface MyReview {
  id: string;
  restaurantName: string;
  address: string;
  user: {
    name: string;
    reviews: number;
    followers: number;
    following: number;
  };
  rating: number;       // 1~5
  timeAgo: string;      // 예: '5시간 전'
  likeCount: number;
  photos: string[];     // 서버 이미지 URL 배열
  reviewText: string;
}

const NAV_TABS = [
  { id: 'home',  label: 'HOME',  image: require('../../assets/images/nav/home.png'),  w: 32, h: 32 },
  { id: 'look',  label: 'LOOK',  image: require('../../assets/images/nav/look.png'),  w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like',  label: 'LIKE',  image: require('../../assets/images/nav/like.png'),  w: 27, h: 23 },
  { id: 'my',    label: 'MY',    image: require('../../assets/images/nav/my.png'),    w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

interface WriteScreenProps {
  onNavigate?: (tabId: string) => void;
  onWriteReview?: () => void;
}

function ReviewCardSkeleton() {
  return (
    <View style={[styles.card, styles.cardEmpty]}>
      <View style={styles.cardTop}>
        <View style={styles.skeletonName} />
        <View style={styles.cardActions}>
          <Image source={require('../../assets/images/icon-heart.png')} style={styles.actionIcon} resizeMode="contain" />
          <Text style={styles.moreIcon}>•••</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircleSkeleton} />
        <View>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: 120, marginTop: 4 }]} />
        </View>
      </View>
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Text key={i} style={[styles.starIcon, styles.starEmpty]}>★</Text>
        ))}
      </View>
      <View style={styles.photoPlaceholder}>
        <Text style={styles.photoPlaceholderText}>사진</Text>
      </View>
      <View style={[styles.skeletonLine, { width: '90%', marginHorizontal: 12, marginTop: 10 }]} />
      <View style={[styles.skeletonLine, { width: '70%', marginHorizontal: 12, marginTop: 6, marginBottom: 12 }]} />
    </View>
  );
}

function ReviewCard({ review }: { review: MyReview }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.cardRestaurantName}>{review.restaurantName}</Text>
          <Text style={styles.cardRestaurantAddress}>{review.address}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={require('../../assets/images/icon-heart.png')} style={styles.actionIcon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.moreIcon}>•••</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{review.user.name[0]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.user.name}</Text>
          <Text style={styles.userStats}>
            리뷰 {review.user.reviews} • 팔로워 {review.user.followers} • 팔로잉 {review.user.following}
          </Text>
        </View>
      </View>
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Text key={i} style={[styles.starIcon, i < review.rating ? styles.starFilled : styles.starEmpty]}>★</Text>
        ))}
        <Text style={styles.timeAgo}>{review.timeAgo}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photoScroll}
        contentContainerStyle={styles.photoScrollContent}
      >
        {review.photos.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={[styles.photo, idx === 0 && styles.photoFirst]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <Text style={styles.reviewText}>{review.reviewText}</Text>
      <View style={styles.likeRow}>
        <Text style={styles.likeCount}>♥ {review.likeCount}</Text>
      </View>
    </View>
  );
}

export default function WriteScreen({ onNavigate, onWriteReview }: WriteScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = navBottom + NAV_HEIGHT + 40 + 10 + 16;

  const [reviews, setReviews] = useState<MyReview[]>([]);

  useEffect(() => {
    // TODO: 내가 작성한 후기 목록 API
    setReviews([]);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleArea}>
          <Text style={styles.titleText}>내가 작성한 후기에요</Text>
        </View>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </>
        )}

      </ScrollView>

      {/* 하단 작성 버튼 */}
      <View style={[styles.writeButtonWrapper, { bottom: navBottom + NAV_HEIGHT + 10 }]} pointerEvents="box-none">
        <TouchableOpacity style={styles.writeButton} activeOpacity={0.8} onPress={onWriteReview}>
          <Text style={styles.writeButtonText}>작성</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 네비게이션 */}
      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => onNavigate?.(tab.id)}
            >
              <View style={[
                styles.navTabInner,
                tab.id === 'write' && styles.navTabInnerActive,
                (tab as any).pb ? { paddingBottom: (tab as any).pb } : null,
              ]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, tab.id === 'write' && styles.navLabelActive]}>
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

  titleArea: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 28,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 14,
  },

  loadingArea: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 후기 카드 */
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 12,
  },
  cardEmpty: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
  },

  /* 카드 상단: 식당명 + 하트 + 점3개 */
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  cardRestaurantName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000',
    lineHeight: 25,
  },
  cardRestaurantAddress: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#595959',
    lineHeight: 15,
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
  avatarCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.light.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter-Bold' },
  avatarCircleSkeleton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D0D0D0' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000', lineHeight: 21 },
  userStats: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#828282', lineHeight: 14 },

  /* 별점 */
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 10,
  },
  starIcon: { fontSize: 12, lineHeight: 14 },
  starFilled: { color: '#FFD700' },
  starEmpty: { color: '#D0D0D0' },
  timeAgo: { fontSize: 8, fontWeight: '500', color: '#828282', marginLeft: 4 },

  /* 사진 */
  photoScroll: { marginBottom: 10 },
  photoScrollContent: { paddingHorizontal: 12, gap: 6 },
  photo: { width: 151, height: 151, borderRadius: 6 },
  photoFirst: { width: 121 },
  photoPlaceholder: {
    height: 151, marginHorizontal: 12, borderRadius: 6,
    backgroundColor: '#D0D0D0', alignItems: 'center', justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 13, color: '#888' },

  reviewText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
    lineHeight: 17,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  likeRow: { paddingHorizontal: 12, marginBottom: 12 },
  likeCount: { fontSize: 13, color: '#FF3B30', fontWeight: '600' },

  skeletonName: { width: 100, height: 18, borderRadius: 4, backgroundColor: '#D0D0D0', marginBottom: 4 },
  skeletonLine: { height: 10, borderRadius: 4, backgroundColor: '#D0D0D0', width: 200 },

  /* 하단 버튼 */
  writeButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  writeButton: {
    width: 327,
    height: 40,
    backgroundColor: '#85EB6C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  writeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
    lineHeight: 20,
  },

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
  navLabel: {
    position: 'absolute',
    bottom: 3,
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'Inter',
    color: '#000',
  },
  navLabelActive: { fontWeight: '300' },
});
