import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

// 서버에서 받아올 팔로워 최근 후기 타입
interface FollowerReview {
  followerName: string;     // 예: 다연
  itemName: string;         // 예: 정보처리기사
  user: {
    name: string;
    reviews: number;
    followers: number;
    following: number;
  };
  rating: number;
  timeAgo: string;
  photos: string[];         // 서버 이미지 URL (최대 2장 나란히 표시)
  reviewText: string;
}

// 서버에서 받아올 개인화 추천 타입
interface PersonalRecommendation {
  category: string;           // 예: 카페
  username: string;           // 예: 영재
  featuredReview: {
    imageUrl: string;
    title: string;            // 예: 뚜쥬른 빵돌가마마을
    address: string;          // 예: 충청남도 천안시 동남구 풍세로 706
  };
  relatedKeyword: string;     // 예: 왕과 사는 남자
  relatedLocation: string;    // 예: 영릉
  nearbyPlaces: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
}

// 서버에서 받아올 최신 트렌드 아이템 타입
interface TrendItem {
  id: string;
  imageUrl: string;  // 서버 이미지 URL
  title: string;
  category: string;
}

// 서버에서 받아올 인기 후기 타입
interface TopReview {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  user: {
    name: string;
    reviews: number;
    followers: number;
    following: number;
  };
  rating: number;
  timeAgo: string;
  photos: string[];   // 서버 이미지 URL 배열
  reviewText: string;
  likeCount: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SKELETON_TREND_COUNT = 3;

const NAV_TABS = [
  { id: 'home',  label: 'HOME',  image: require('../../assets/images/nav/home.png'),  w: 32, h: 32 },
  { id: 'look',  label: 'LOOK',  image: require('../../assets/images/nav/look.png'),  w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like',  label: 'LIKE',  image: require('../../assets/images/nav/like.png'),  w: 27, h: 23 },
  { id: 'my',    label: 'MY',    image: require('../../assets/images/nav/my.png'),    w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;


interface LookScreenProps {
  onNavigate?: (tabId: string) => void;
}

export default function LookScreen({ onNavigate }: LookScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 20;

  const [topReview, setTopReview] = useState<TopReview | null>(null);
  const [topLoading, setTopLoading] = useState(true);

  const [trendItems, setTrendItems] = useState<TrendItem[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);

  const [yesterdayReview, setYesterdayReview] = useState<TopReview | null>(null);
  const [yesterdayLoading, setYesterdayLoading] = useState(true);

  const [followerReview, setFollowerReview] = useState<FollowerReview | null>(null);
  const [followerLoading, setFollowerLoading] = useState(true);

  const [personalRec, setPersonalRec] = useState<PersonalRecommendation | null>(null);
  const [personalLoading, setPersonalLoading] = useState(true);

  useEffect(() => {
    // TODO: 가장 좋아요 많은 후기 API
    // fetch('https://api.mowho.com/reviews/top')
    //   .then(res => res.json())
    //   .then((data: TopReview) => { setTopReview(data); setTopLoading(false); })
    //   .catch(() => setTopLoading(false));
    setTopLoading(false);
  }, []);

  useEffect(() => {
    // TODO: 최신 트렌드 목록 API
    // fetch('https://api.mowho.com/trends')
    //   .then(res => res.json())
    //   .then((data: TrendItem[]) => { setTrendItems(data); setTrendLoading(false); })
    //   .catch(() => setTrendLoading(false));
    setTrendLoading(false);
  }, []);

  useEffect(() => {
    // TODO: 어제 좋아요 1위 후기 API
    // fetch('https://api.mowho.com/reviews/yesterday-top')
    //   .then(res => res.json())
    //   .then((data: TopReview) => { setYesterdayReview(data); setYesterdayLoading(false); })
    //   .catch(() => setYesterdayLoading(false));
    setYesterdayLoading(false);
  }, []);

  useEffect(() => {
    // TODO: 팔로워 최근 후기 API
    // fetch('https://api.mowho.com/followers/recent-review')
    //   .then(res => res.json())
    //   .then((data: FollowerReview) => { setFollowerReview(data); setFollowerLoading(false); })
    //   .catch(() => setFollowerLoading(false));
    setFollowerLoading(false);
  }, []);

  useEffect(() => {
    // TODO: 유저 카테고리 기반 개인화 추천 API
    // fetch('https://api.mowho.com/recommendations/personal')
    //   .then(res => res.json())
    //   .then((data: PersonalRecommendation) => { setPersonalRec(data); setPersonalLoading(false); })
    //   .catch(() => setPersonalLoading(false));
    setPersonalLoading(false);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* 검색창 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#828282"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >

        {/* 지금 이게 뜨고 있어요 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 이게 뜨고 있어요</Text>
          <Text style={styles.sectionSub}>실시간 업데이트 중</Text>

          {/* 인기 후기 카드 */}
          {topLoading ? (
            <View style={styles.cardLoading}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : topReview ? (
            <View style={styles.card}>
              {/* 식당명 + 주소 + 액션 버튼 */}
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardRestaurantName}>{topReview.restaurantName}</Text>
                  <Text style={styles.cardRestaurantAddress}>{topReview.restaurantAddress}</Text>
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

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 유저 프로필 */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{topReview.user.name[0]}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{topReview.user.name}</Text>
                  <Text style={styles.userStats}>
                    리뷰 {topReview.user.reviews} • 팔로워 {topReview.user.followers} • 팔로잉 {topReview.user.following}
                  </Text>
                </View>
              </View>

              {/* 별점 + 시간 */}
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text key={i} style={[styles.starIcon, i < topReview.rating ? styles.starFilled : styles.starEmpty]}>★</Text>
                ))}
                <Text style={styles.timeAgo}>{topReview.timeAgo}</Text>
              </View>

              {/* 사진 가로 스크롤 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photoScroll}
                contentContainerStyle={styles.photoScrollContent}
              >
                {topReview.photos.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={[styles.photo, idx === 0 && styles.photoFirst]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* 리뷰 텍스트 */}
              <Text style={styles.reviewText}>{topReview.reviewText}</Text>

              {/* 좋아요 수 */}
              <View style={styles.likeRow}>
                <Text style={styles.likeCount}>♥ {topReview.likeCount}</Text>
              </View>
            </View>
          ) : (
            /* 데이터 없을 때 빈 카드 틀 */
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
          )}
        </View>

        {/* 최신 트렌드 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>최신 트렌드</Text>

          {trendLoading ? (
            <View style={styles.trendLoadingRow}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : trendItems.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.trendScroll}
              contentContainerStyle={styles.trendScrollContent}
            >
              {trendItems.map((card) => (
                <TouchableOpacity key={card.id} style={styles.trendCard} activeOpacity={0.85}>
                  <Image source={{ uri: card.imageUrl }} style={styles.trendImage} resizeMode="cover" />
                  <View style={styles.trendOverlay}>
                    <Text style={styles.trendCategory}>{card.category}</Text>
                    <Text style={styles.trendTitle}>{card.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            /* 데이터 없을 때 스켈레톤 카드 3장 */
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.trendScroll}
              contentContainerStyle={styles.trendScrollContent}
            >
              {Array.from({ length: SKELETON_TREND_COUNT }).map((_, i) => (
                <View key={i} style={[styles.trendCard, styles.trendCardSkeleton]}>
                  <View style={styles.trendSkeletonImage} />
                  <View style={styles.trendSkeletonOverlay}>
                    <View style={styles.trendSkeletonCategory} />
                    <View style={styles.trendSkeletonTitle} />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* 어제 가장 핫한 후기였어요 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>어제 가장 핫한 후기였어요</Text>

          {yesterdayLoading ? (
            <View style={styles.cardLoading}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : yesterdayReview ? (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardRestaurantName}>{yesterdayReview.restaurantName}</Text>
                  <Text style={styles.cardRestaurantAddress}>{yesterdayReview.restaurantAddress}</Text>
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
                  <Text style={styles.avatarText}>{yesterdayReview.user.name[0]}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{yesterdayReview.user.name}</Text>
                  <Text style={styles.userStats}>
                    리뷰 {yesterdayReview.user.reviews} • 팔로워 {yesterdayReview.user.followers} • 팔로잉 {yesterdayReview.user.following}
                  </Text>
                </View>
              </View>
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text key={i} style={[styles.starIcon, i < yesterdayReview.rating ? styles.starFilled : styles.starEmpty]}>★</Text>
                ))}
                <Text style={styles.timeAgo}>{yesterdayReview.timeAgo}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll} contentContainerStyle={styles.photoScrollContent}>
                {yesterdayReview.photos.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={[styles.photo, idx === 0 && styles.photoFirst]} resizeMode="cover" />
                ))}
              </ScrollView>
              <Text style={styles.reviewText}>{yesterdayReview.reviewText}</Text>
              <View style={styles.likeRow}>
                <Text style={styles.likeCount}>♥ {yesterdayReview.likeCount}</Text>
              </View>
            </View>
          ) : (
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
          )}
        </View>

        {/* OO 카테고리를 고르신 OO님께 추천드려요 */}
        <View style={styles.section}>
          {personalLoading ? (
            <View style={styles.cardLoading}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : personalRec ? (
            <>
              {/* 섹션 타이틀: font-weight 800, font-size 20 */}
              <Text style={styles.personalTitle}>
                {personalRec.category} 카테고리를 고르신 {personalRec.username} 님께 추천드려요
              </Text>

              {/* 대표 추천 카드: 345×230, border-radius 20 */}
              <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}>
                <Image source={{ uri: personalRec.featuredReview.imageUrl }} style={styles.featuredImage} resizeMode="cover" />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>{personalRec.featuredReview.title}</Text>
                  <Text style={styles.featuredAddress}>{personalRec.featuredReview.address}</Text>
                </View>
              </TouchableOpacity>

              {/* 서브 추천 텍스트: font-size 17, font-weight 800 */}
              <Text style={styles.personalSubText}>
                {personalRec.relatedKeyword}에 대한 후기를 찾아본 {personalRec.username}님 {personalRec.relatedLocation} 주변 후기를 추천드려요
              </Text>

              {/* 주변 장소 가로 스크롤: 165×188, 텍스트 오버레이 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendScroll} contentContainerStyle={styles.trendScrollContent}>
                {personalRec.nearbyPlaces.map((place) => (
                  <TouchableOpacity key={place.id} style={styles.placeCard} activeOpacity={0.85}>
                    <Image source={{ uri: place.imageUrl }} style={styles.placeImage} resizeMode="cover" />
                    <View style={styles.placeOverlay}>
                      <Text style={styles.placeName} numberOfLines={2}>{place.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              {/* 타이틀 - OO로 표시 */}
              <Text style={styles.personalTitle}>OO 카테고리를 고르신 OO님께 추천드려요</Text>

              {/* 스켈레톤 대표 카드 345×230 */}
              <View style={styles.featuredCardSkeleton} />

              {/* 서브 텍스트 - OO로 표시 */}
              <Text style={styles.personalSubText}>
                OO에 대한 후기를 찾아본 OO님{'\n'}OO 주변 후기를 추천드려요
              </Text>

              {/* 스켈레톤 장소 카드 3장: 165×188 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendScroll} contentContainerStyle={styles.trendScrollContent}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} style={styles.placeCardSkeleton} />
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* 팔로워 최근 후기 */}
        <View style={styles.section}>
          {followerLoading ? (
            <View style={styles.cardLoading}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : followerReview ? (
            <>
              <Text style={styles.followerTitle}>
                내 팔로워 {followerReview.followerName}님이{'\n'}최근에 새로운 후기를 남기셨어요
              </Text>
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardRestaurantName}>{followerReview.itemName}</Text>
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
                    <Text style={styles.avatarText}>{followerReview.user.name[0]}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{followerReview.user.name}</Text>
                    <Text style={styles.userStats}>
                      리뷰 {followerReview.user.reviews} • 팔로워 {followerReview.user.followers} • 팔로잉 {followerReview.user.following}
                    </Text>
                  </View>
                </View>
                <View style={styles.ratingRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Text key={i} style={[styles.starIcon, i < followerReview.rating ? styles.starFilled : styles.starEmpty]}>★</Text>
                  ))}
                  <Text style={styles.timeAgo}>{followerReview.timeAgo}</Text>
                </View>
                <View style={styles.photoRow}>
                  {followerReview.photos.slice(0, 2).map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={styles.photoRowItem} resizeMode="cover" />
                  ))}
                </View>
                <Text style={styles.reviewText}>{followerReview.reviewText}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.followerTitle}>내 팔로워 OO님이{'\n'}최근에 새로운 후기를 남기셨어요</Text>
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
                <View style={styles.photoRow}>
                  <View style={styles.photoRowSkeleton} />
                  <View style={styles.photoRowSkeleton} />
                </View>
                <View style={[styles.skeletonLine, { width: '90%', marginHorizontal: 12, marginTop: 10 }]} />
                <View style={[styles.skeletonLine, { width: '70%', marginHorizontal: 12, marginTop: 6, marginBottom: 12 }]} />
              </View>
            </>
          )}
        </View>

      </ScrollView>

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
                tab.id === 'look' && styles.navTabInnerActive,
                (tab as any).pb ? { paddingBottom: (tab as any).pb } : null,
              ]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, tab.id === 'look' && styles.navLabelActive]}>
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
  },
  searchIconText: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Inter', color: '#000' },

  /* 스크롤 */
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 20, paddingHorizontal: 15 },

  /* 섹션 */
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 28,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#828282',
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 10,
  },

  /* 인기 후기 카드 */
  cardLoading: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  cardEmpty: { borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed' },
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
  divider: { height: 1, backgroundColor: '#5C5C5C', marginHorizontal: 0, marginBottom: 10 },
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
  avatarCircleSkeleton: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#D0D0D0',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000', lineHeight: 21 },
  userStats: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#828282', lineHeight: 14 },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, gap: 4, marginBottom: 10,
  },
  starIcon: { fontSize: 12, lineHeight: 14 },
  starFilled: { color: '#FFD700' },
  starEmpty: { color: '#D0D0D0' },
  timeAgo: { fontSize: 8, fontWeight: '500', color: '#828282', marginLeft: 4 },
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
    fontSize: 12, fontWeight: '500', fontFamily: 'Inter',
    color: '#000', lineHeight: 17, paddingHorizontal: 12, marginBottom: 10,
  },
  likeRow: { paddingHorizontal: 12, marginBottom: 12 },
  likeCount: { fontSize: 13, color: '#FF3B30', fontWeight: '600' },
  skeletonName: { width: 100, height: 18, borderRadius: 4, backgroundColor: '#D0D0D0', marginBottom: 4 },
  skeletonLine: { height: 10, borderRadius: 4, backgroundColor: '#D0D0D0', width: 200 },

  /* 최신 트렌드 카드 */
  trendLoadingRow: {
    height: 188,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendScroll: { marginTop: 0 },
  trendScrollContent: { gap: 6 },
  trendCard: {
    width: 165,
    height: 188,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  trendCardSkeleton: {
    backgroundColor: '#E8E8E8',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
  },
  trendImage: { width: 165, height: 188 },
  trendSkeletonImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D0D0D0',
  },
  trendOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    right: 8,
  },
  trendSkeletonOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    right: 8,
    gap: 6,
  },
  trendSkeletonCategory: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  trendSkeletonTitle: {
    width: 110,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  trendCategory: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  trendTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 21,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },

  /* 팔로워 후기 */
  followerTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 10,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  photoRowItem: {
    width: 151,
    height: 151,
    borderRadius: 6,
  },
  photoRowSkeleton: {
    width: 151,
    height: 151,
    borderRadius: 6,
    backgroundColor: '#D0D0D0',
  },

  /* 개인화 추천 */
  personalTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 28,
    marginBottom: 10,
  },
  featuredCard: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredCardSkeleton: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    backgroundColor: '#D0D0D0',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderStyle: 'dashed',
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 17,
    right: 17,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  featuredAddress: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 14,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  personalSubText: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  placeCard: {
    width: 165,
    height: 188,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  placeCardSkeleton: {
    width: 165,
    height: 188,
    borderRadius: 10,
    backgroundColor: '#D0D0D0',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderStyle: 'dashed',
  },
  placeImage: { width: 165, height: 188 },
  placeOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    right: 8,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 21,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
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
  navLabel: { position: 'absolute', bottom: 3, fontSize: 10, fontWeight: '300', fontFamily: 'Inter', color: '#000' },
  navLabelActive: { fontWeight: '300' },
});
