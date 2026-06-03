# React Native Mowho 개발 가이드

## 📁 프로젝트 구조

```
src/
├── app/                 # 페이지 및 라우팅 (Expo Router)
│   ├── _layout.tsx     # 레이아웃 정의
│   ├── index.tsx       # 홈 페이지
│   ├── explore.tsx     # Explore 페이지
│   └── profile.tsx     # 프로필 페이지 (새로 생성)
├── components/         # 재사용 가능한 컴포넌트
│   ├── button.tsx      # 버튼 컴포넌트
│   ├── input.tsx       # 입력 필드 컴포넌트
│   ├── card.tsx        # 카드 컴포넌트
│   └── ...
├── hooks/              # 커스텀 React Hooks
│   └── useCustom.ts    # 데이터 페칭, 로컬 스토리지 등
├── services/           # API 및 외부 서비스
│   └── api.ts          # API 호출 함수
├── utils/              # 유틸리티 함수
│   ├── helpers.ts      # 포맷팅, 검증, 문자열 등
│   └── logger.ts       # 로깅 유틸리티
├── config/             # 설정 파일
│   └── env.ts          # 환경 설정
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 공통 타입
├── constants/          # 상수
└── assets/             # 이미지, 폰트 등
```

## 🚀 개발 시작하기

### 1. 개발 서버 실행
```bash
npm start
# 또는
npm run web      # 웹 브라우저
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
```

### 2. 새 페이지 추가하기
`src/app/` 디렉토리에 `.tsx` 파일을 추가하면 자동으로 라우팅됩니다.

예시:
```tsx
// src/app/settings.tsx
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  return (
    <View>
      <ThemedText>설정</ThemedText>
    </View>
  );
}
```

### 3. 컴포넌트 사용하기
```tsx
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';

export default function MyScreen() {
  return (
    <Card>
      <Input label="이름" placeholder="이름 입력" />
      <Button title="제출" onPress={() => {}} />
    </Card>
  );
}
```

### 4. API 호출하기
```tsx
import { userApi } from '@/services/api';
import { useApi } from '@/hooks/useCustom';

export default function ProfileScreen() {
  const { data, loading, error } = useApi(() => userApi.getProfile());

  if (loading) return <Text>로딩중...</Text>;
  if (error) return <Text>에러: {error}</Text>;
  
  return <Text>{data?.name}</Text>;
}
```

### 5. 유틸리티 함수 사용
```tsx
import { formatters, validators, stringUtils } from '@/utils/helpers';

// 날짜 포맷
formatters.date(new Date());

// 이메일 검증
validators.email('test@example.com');

// 문자열 Slug 변환
stringUtils.slugify('Hello World');
```

## 🔧 주요 기능

### 제공하는 Hook
- `useApi<T>()` - API 데이터 페칭
- `useLocalStorage<T>()` - 로컬 스토리지
- `useDebounce<T>()` - 디바운싱
- `useToggle()` - 토글 상태

### 제공하는 유틸리티
- **formatters** - 날짜, 숫자, 시간 포맷
- **validators** - 이메일, URL, 전화번호, 비밀번호 검증
- **stringUtils** - 문자열 조작
- **arrayUtils** - 배열 조작
- **objectUtils** - 객체 조작

### API 서비스
```tsx
import { get, post, put, deleteRequest } from '@/services/api';

// GET
const response = await get('/endpoint');

// POST
const response = await post('/endpoint', { key: 'value' });

// PUT
const response = await put('/endpoint', { key: 'value' });

// DELETE
const response = await deleteRequest('/endpoint');
```

## 📝 TypeScript 타입

기본 타입:
```tsx
import { User, ApiResponse, PaginatedResponse } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}
```

## 🐛 디버깅

### 로깅
```tsx
import { logger } from '@/utils/logger';

logger.debug('메시지', { data: 'value' });
logger.info('정보');
logger.warn('경고');
logger.error('에러', error);
```

### VS Code 디버깅
1. `F5` 또는 Run > Start Debugging 선택
2. 중단점 설정 후 자동으로 디버거 시작

## 📚 리소스

- [Expo 문서](https://docs.expo.dev/)
- [React Native 문서](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript](https://www.typescriptlang.org/)

## ✨ 팁

1. Hot Reload 사용: Ctrl+M (Android) 또는 Cmd+D (iOS)
2. 컴포넌트는 항상 `src/components/`에 넣기
3. 페이지는 항상 `src/app/`에 넣기
4. API 호출은 `src/services/`에서 관리하기
5. 타입 정의는 항상 `src/types/`에 넣기

---

Happy coding! 🎉
