export interface Review {
  user: {
    name: string;
    reviews: number;
    followers: number;
    following: number;
  };
  timeAgo: string;
  likes: number;
  rating: number;
  photos: ReturnType<typeof require>[];
  text: string;
}

export interface BannerItem {
  title: string;
  address: string;
  reviews: Review[];
}

export const BANNERS_DATA: BannerItem[] = [
  {
    title: '상명대학교 천안캠퍼스',
    address: '충청남도 천안시 동남구 상명대길 31',
    reviews: [
      {
        user: { name: '캠퍼스투어', reviews: 34, followers: 128, following: 67 },
        timeAgo: '1주일 전',
        likes: 42,
        rating: 4,
        photos: [
          require('../../assets/images/restaurant-yagob-1.png'),
          require('../../assets/images/restaurant-yagob-2.png'),
        ],
        text: '봄에 벚꽃이 정말 아름다워요. 캠퍼스 산책로가 잘 정비되어 있어서 걷기 좋았습니다.',
      },
      {
        user: { name: '대학탐방러', reviews: 12, followers: 45, following: 30 },
        timeAgo: '3주 전',
        likes: 28,
        rating: 5,
        photos: [
          require('../../assets/images/restaurant-yagob-2.png'),
        ],
        text: '조용하고 깔끔한 캠퍼스예요. 사진 찍기에도 정말 좋은 장소입니다!',
      },
      {
        user: { name: '천안여행자', reviews: 7, followers: 22, following: 18 },
        timeAgo: '1개월 전',
        likes: 15,
        rating: 4,
        photos: [
          require('../../assets/images/restaurant-yagob-3.png'),
        ],
        text: '학교 건물들이 현대적이고 예뻐요. 캠퍼스 내 카페도 있어서 쉬어가기 좋았어요.',
      },
    ],
  },
  {
    title: '호미곶 해맞이 광장',
    address: '경북 포항시 남구 호미곶면 대보리',
    reviews: [
      {
        user: { name: '일출매니아', reviews: 58, followers: 312, following: 144 },
        timeAgo: '5개월 전',
        likes: 67,
        rating: 5,
        photos: [
          require('../../assets/images/restaurant-yagob-2.png'),
          require('../../assets/images/restaurant-yagob-3.png'),
        ],
        text: '새해 일출을 보러 왔는데 정말 장관이었어요! 상생의 손 포토스팟도 너무 좋았습니다.',
      },
      {
        user: { name: '포항여행자', reviews: 21, followers: 89, following: 56 },
        timeAgo: '4개월 전',
        likes: 34,
        rating: 4,
        photos: [
          require('../../assets/images/restaurant-yagob-3.png'),
        ],
        text: '날씨가 좋으면 정말 멋진 일출을 볼 수 있어요. 주변 해산물도 강력 추천!',
      },
      {
        user: { name: '동해바다러', reviews: 9, followers: 33, following: 27 },
        timeAgo: '6개월 전',
        likes: 21,
        rating: 5,
        photos: [
          require('../../assets/images/restaurant-yagob-1.png'),
        ],
        text: '한반도 최동단 끝! 바다 전망이 정말 탁 트여 있어요. 꼭 한번 방문해보세요.',
      },
    ],
  },
  {
    title: '제주 훌릭 뮤지엄',
    address: '제주 제주시 애월읍 평화로 2835',
    reviews: [
      {
        user: { name: '제주덕후', reviews: 43, followers: 201, following: 98 },
        timeAgo: '1개월 전',
        likes: 53,
        rating: 5,
        photos: [
          require('../../assets/images/restaurant-yagob-3.png'),
          require('../../assets/images/restaurant-yagob-1.png'),
        ],
        text: '감각적인 전시가 정말 좋았어요. 인스타 감성 사진 찍기에 최고인 곳!',
      },
      {
        user: { name: '뮤지엄투어', reviews: 16, followers: 62, following: 41 },
        timeAgo: '2개월 전',
        likes: 31,
        rating: 4,
        photos: [
          require('../../assets/images/restaurant-yagob-1.png'),
        ],
        text: '제주에서 우천 시 방문하기 딱 좋은 실내 명소예요. 전시 퀄리티가 높아서 만족했어요.',
      },
      {
        user: { name: '애월탐방자', reviews: 5, followers: 18, following: 12 },
        timeAgo: '3개월 전',
        likes: 19,
        rating: 5,
        photos: [
          require('../../assets/images/restaurant-yagob-2.png'),
        ],
        text: '예술적인 공간에서 힐링할 수 있었어요. 입장권 가격도 합리적이에요.',
      },
    ],
  },
];

export function getMostLikedPhoto(bannerIndex: number): ReturnType<typeof require> | null {
  const banner = BANNERS_DATA[bannerIndex];
  if (!banner) return null;
  const sorted = [...banner.reviews].sort((a, b) => b.likes - a.likes);
  return sorted[0]?.photos[0] ?? null;
}
