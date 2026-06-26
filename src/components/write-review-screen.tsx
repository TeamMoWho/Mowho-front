import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library/legacy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOCATIONS: { id: string; name: string; address: string; category: string }[] = [];

const CATEGORIES = ['캠퍼스', '교육', '전공', '기숙사', '대학원', '동아리'];

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <Text style={hlStyles.match}>{text}</Text>;
  }
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'i'));
  return (
    <Text>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <Text key={i} style={hlStyles.match}>{part}</Text>
          : <Text key={i} style={hlStyles.rest}>{part}</Text>
      )}
    </Text>
  );
}

const hlStyles = StyleSheet.create({
  match: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter', color: '#51E92B' },
  rest:  { fontSize: 16, fontWeight: '700', fontFamily: 'Inter', color: '#595959' },
});

const NAV_TABS = [
  { id: 'home',  label: 'HOME',  image: require('../../assets/images/nav/home.png'),  w: 32, h: 32 },
  { id: 'look',  label: 'LOOK',  image: require('../../assets/images/nav/look.png'),  w: 31, h: 27 },
  { id: 'write', label: 'WRITE', image: require('../../assets/images/nav/write.png'), w: 29, h: 29, pb: 17 },
  { id: 'like',  label: 'LIKE',  image: require('../../assets/images/nav/like.png'),  w: 27, h: 23 },
  { id: 'my',    label: 'MY',    image: require('../../assets/images/nav/my.png'),    w: 31, h: 35 },
];

const NAV_HEIGHT = 54;
const NAV_MARGIN_BOTTOM = -8;

function CategoryModal({
  visible,
  onClose,
  selectedCategories,
  onToggle,
}: {
  visible: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onToggle: (name: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState('추천');
  const [categorySearch, setCategorySearch] = useState('');
  const [savedCategories, setSavedCategories] = useState<string[]>([]);

  const translateY = useRef(new Animated.Value(700)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(700);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
          overlayOpacity.setValue(Math.max(0, 1 - gs.dy / 300));
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.5) {
          Animated.parallel([
            Animated.timing(translateY, { toValue: 700, duration: 200, useNativeDriver: true }),
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start(() => onClose());
        } else {
          Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(overlayOpacity, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 700, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const toggleSaved = (name: string) => {
    setSavedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const filtered = (() => {
    let list = CATEGORIES;
    if (activeFilter === '저장됨') list = list.filter(c => savedCategories.includes(c));
    if (categorySearch) list = list.filter(c => c.includes(categorySearch));
    return list;
  })();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      <View style={catStyles.overlay}>
        <Animated.View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, catStyles.overlayBg, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeWithAnimation} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <View style={catStyles.sheet}>
            <View {...panResponder.panHandlers} style={catStyles.handleArea}>
              <View style={catStyles.handle} />
              <Text style={catStyles.sheetTitle}>최대 5개 선택해주세요</Text>
            </View>
            <View style={catStyles.searchBar}>
              <Image
                source={require('../../assets/images/icon-search.png')}
                style={catStyles.searchIcon}
                resizeMode="contain"
              />
              <TextInput
                style={catStyles.searchInput}
                placeholder="카테고리를 검색해주세요"
                placeholderTextColor="#828282"
                value={categorySearch}
                onChangeText={setCategorySearch}
              />
            </View>
            <View style={catStyles.filterRow}>
              {(['추천', '인기', '저장됨'] as const).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[catStyles.filterTab, activeFilter === tab && catStyles.filterTabOn]}
                  onPress={() => setActiveFilter(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={catStyles.filterTabText}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScrollView style={catStyles.catList} showsVerticalScrollIndicator={false}>
              {filtered.map((cat) => (
                <View
                  key={cat}
                  style={[catStyles.catRow, selectedCategories.includes(cat) && catStyles.catRowSelected]}
                >
                  <TouchableOpacity
                    style={catStyles.catRowMain}
                    onPress={() => onToggle(cat)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../assets/images/icon-chevron-right.png')}
                      style={catStyles.chevron}
                      resizeMode="contain"
                    />
                    <Text style={catStyles.catName}>{cat}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleSaved(cat)} activeOpacity={0.7} style={catStyles.starButton}>
                    <Image
                      source={
                        savedCategories.includes(cat)
                          ? require('../../assets/images/icon-star-filled.png')
                          : require('../../assets/images/icon-star-empty.png')
                      }
                      style={catStyles.star}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={catStyles.addButtonWrapper}>
              <TouchableOpacity style={catStyles.addButton} activeOpacity={0.8} onPress={closeWithAnimation}>
                <Text style={catStyles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const PHOTO_SIZE = Math.floor((SCREEN_WIDTH - 12) / 3);

function PhotoModal({
  visible,
  onClose,
  selectedPhotos,
  onToggle,
}: {
  visible: boolean;
  onClose: () => void;
  selectedPhotos: string[];
  onToggle: (uri: string) => void;
}) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

  const translateY = useRef(new Animated.Value(700)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(700);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      loadPhotos();
    }
  }, [visible]);

  const loadPhotos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return;
    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 60,
      sortBy: [['creationTime', false]],
    });
    setPhotos(assets);
  };

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 700, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
          overlayOpacity.setValue(Math.max(0, 1 - gs.dy / 300));
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.5) {
          Animated.parallel([
            Animated.timing(translateY, { toValue: 700, duration: 200, useNativeDriver: true }),
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start(() => onClose());
        } else {
          Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(overlayOpacity, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      <View style={photoStyles.overlay}>
        <Animated.View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, photoStyles.overlayBg, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeWithAnimation} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <View style={photoStyles.sheet}>
            <View {...panResponder.panHandlers} style={photoStyles.handleArea}>
              <View style={photoStyles.handle} />
              <Text style={photoStyles.sheetTitle}>최대 10개 선택해주세요</Text>
            </View>
            <FlatList
              data={photos}
              keyExtractor={item => item.id}
              numColumns={3}
              style={photoStyles.grid}
              contentContainerStyle={photoStyles.gridContent}
              columnWrapperStyle={{ gap: 3 }}
              ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selIdx = selectedPhotos.indexOf(item.uri);
                const isSelected = selIdx !== -1;
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      if (!isSelected && selectedPhotos.length >= 10) return;
                      onToggle(item.uri);
                    }}
                  >
                    <View style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}>
                      <Image source={{ uri: item.uri }} style={photoStyles.photo} />
                      {isSelected && (
                        <>
                          <View style={photoStyles.selectedOverlay} />
                          <View style={photoStyles.badge}>
                            <Text style={photoStyles.badgeText}>{selIdx + 1}</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <View style={photoStyles.addButtonWrapper}>
              <TouchableOpacity style={photoStyles.addButton} activeOpacity={0.8} onPress={closeWithAnimation}>
                <Text style={photoStyles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

interface WriteReviewScreenProps {
  onBack?: () => void;
  onNavigate?: (tabId: string) => void;
}

export default function WriteReviewScreen({ onBack, onNavigate }: WriteReviewScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 60 + 40 + 10;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationResults, setLocationResults] = useState<typeof LOCATIONS>([]);
  const locationBarRef = useRef<View>(null);
  const [dropdownTop, setDropdownTop] = useState(0);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showWriteConfirm, setShowWriteConfirm] = useState(false);
  const [showWriteComplete, setShowWriteComplete] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleWritePress = () => {
    if (!location.trim())               { setValidationMsg('위치를 검색해주세요'); return; }
    if (rating === 0)                   { setValidationMsg('만족도를 입력해주세요'); return; }
    if (!reviewText.trim())             { setValidationMsg('후기를 적어주세요'); return; }
    if (selectedCategories.length === 0){ setValidationMsg('카테고리를 추가해 주세요'); return; }
    if (selectedPhotos.length === 0)    { setValidationMsg('사진을 추가해주세요'); return; }
    setShowWriteConfirm(true);
  };

  useEffect(() => {
    if (showWriteComplete) {
      const timer = setTimeout(() => {
        setShowWriteComplete(false);
        onBack?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWriteComplete]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const togglePhoto = (uri: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(uri)) return prev.filter(u => u !== uri);
      if (prev.length >= 10) return prev;
      return [...prev, uri];
    });
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
    if (text.trim().length > 0) {
      const filtered = LOCATIONS.filter(
        l => l.name.includes(text) || l.address.includes(text)
      );
      setLocationResults(filtered);
      setShowLocationResults(filtered.length > 0);
    } else {
      setShowLocationResults(false);
      setLocationResults([]);
    }
  };

  const handleSelectLocation = (name: string) => {
    setLocation(name);
    setShowLocationResults(false);
  };

  const handleLocationBarLayout = () => {
    locationBarRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      setDropdownTop(pageY + height + 4);
    });
  };

  const toggleCategory = (name: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(name)) return prev.filter(c => c !== name);
      if (prev.length >= 5) return prev;
      return [...prev, name];
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* 상단 바 + 뒤로가기 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* 위치찾기 */}
        <View
          ref={locationBarRef}
          style={styles.locationBar}
          onLayout={handleLocationBarLayout}
        >
          <Image source={require('../../assets/images/icon-search.png')} style={styles.locationIcon} resizeMode="contain" />
          <TextInput
            style={styles.locationInput}
            placeholder="위치를 검색해주세요"
            placeholderTextColor="#828282"
            value={location}
            onChangeText={handleLocationChange}
          />
        </View>

        {/* 만족도 */}
        <View style={styles.satisfactionSection}>
          <Text style={styles.satisfactionTitle}>당신의 만족도를 알려주세요</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                <Text style={[styles.star, i <= rating ? styles.starActive : styles.starInactive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 생생한 후기 작성칸 */}
        <View style={styles.writeSection}>
          <Text style={styles.writeSectionTitle}>생생한 후기를 적어주세요</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="생생한 후기를 남겨주세요"
              placeholderTextColor="#828282"
              multiline
              maxLength={400}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{reviewText.length} / 400</Text>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />

        {/* 카테고리 추가 */}
        <TouchableOpacity style={styles.addRow} activeOpacity={0.7} onPress={() => setShowCategoryModal(true)}>
          <Image source={require('../../assets/images/icon-category-add.png')} style={styles.addRowIcon} resizeMode="contain" />
          <Text style={styles.addRowText}>카테고리 추가</Text>
          {selectedCategories.length > 0 && (
            <Text style={styles.addRowCount}>+{selectedCategories.length}개</Text>
          )}
          <Image source={require('../../assets/images/icon-chevron-gray.png')} style={styles.addRowChevron} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.rowDivider} />

        {/* 사진 추가 */}
        <TouchableOpacity style={styles.addRow} activeOpacity={0.7} onPress={() => setShowPhotoModal(true)}>
          <Image source={require('../../assets/images/icon-photo-add.png')} style={styles.addRowIcon} resizeMode="contain" />
          <Text style={styles.addRowText}>사진 추가</Text>
          {selectedPhotos.length > 0 && (
            <Text style={styles.addRowCount}>+{selectedPhotos.length}개</Text>
          )}
          <Image source={require('../../assets/images/icon-chevron-gray.png')} style={styles.addRowChevron} resizeMode="contain" />
        </TouchableOpacity>

      </ScrollView>

      {/* 위치 검색 결과 드롭다운 */}
      {showLocationResults && dropdownTop > 0 && (
        <View style={[styles.locationDropdown, { top: dropdownTop }]}>
          {locationResults.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.locationResultItem, index === 0 && styles.locationResultItemFirst]}
              onPress={() => handleSelectLocation(item.name)}
              activeOpacity={0.7}
            >
              <Image source={require('../../assets/images/icon-location-pin.png')} style={styles.locationResultPin} resizeMode="contain" />
              <View style={styles.locationResultInfo}>
                <HighlightText text={item.name} query={location} />
                <Text style={styles.locationResultAddress}>{item.address}</Text>
              </View>
              <Text style={styles.locationResultCategory}>{item.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 작성 버튼 */}
      <View style={[styles.writeButtonWrapper, { bottom: navBottom + NAV_HEIGHT + 10 }]} pointerEvents="box-none">
        <TouchableOpacity style={styles.writeButton} activeOpacity={0.8} onPress={handleWritePress}>
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

      {/* 작성 완료 화면 */}
      <Modal visible={showWriteComplete} transparent={false} animationType="fade">
        <View style={styles.completeScreen}>
          <Image
            source={require('../../assets/images/clover.png')}
            style={styles.completeImage}
            resizeMode="contain"
          />
          <Text style={styles.completeTitle}>작성이 완료 되었어요</Text>
          <Text style={styles.completeSub}>잠시 뒤 메인 화면으로 돌아가요</Text>
        </View>
      </Modal>

      {/* 유효성 알림 */}
      <Modal visible={!!validationMsg} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertTitleArea}>
              <Text style={styles.alertTitle}>{validationMsg}</Text>
            </View>
            <View style={styles.alertDividerH} />
            <TouchableOpacity style={styles.alertBtn} activeOpacity={0.7} onPress={() => setValidationMsg(null)}>
              <Text style={styles.alertBtnConfirm}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 작성 확인 다이얼로그 */}
      <Modal visible={showWriteConfirm} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertTitleArea}>
              <Text style={styles.alertTitle}>작성하시겠습니까?</Text>
            </View>
            <View style={styles.alertDividerH} />
            <View style={styles.alertButtons}>
              <TouchableOpacity style={styles.alertBtn} activeOpacity={0.7} onPress={() => setShowWriteConfirm(false)}>
                <Text style={styles.alertBtnCancel}>취소</Text>
              </TouchableOpacity>
              <View style={styles.alertDividerV} />
              <TouchableOpacity style={styles.alertBtn} activeOpacity={0.7} onPress={() => { setShowWriteConfirm(false); setShowWriteComplete(true); }}>
                <Text style={styles.alertBtnConfirm}>작성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 사진 선택 모달 */}
      <PhotoModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        selectedPhotos={selectedPhotos}
        onToggle={togglePhoto}
      />

      {/* 카테고리 선택 모달 */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  /* 상단 바 */
  topBar: {
    height: 44,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: { paddingHorizontal: 15, paddingVertical: 8, alignSelf: 'flex-start' },
  backArrow: { fontSize: 22, fontWeight: '600', color: '#000' },

  /* 스크롤 */
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 10 },

  /* 위치찾기 */
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  locationIcon: { width: 24, height: 24 },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000',
  },

  /* 만족도 */
  satisfactionSection: {
    marginHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  satisfactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  star: { fontSize: 35 },
  starActive: { color: '#FFD700' },
  starInactive: { color: '#DADADA' },

  /* 작성칸 */
  writeSection: {
    marginHorizontal: 15,
    marginBottom: 16,
  },
  writeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  textInputWrapper: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    height: 180,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000',
    lineHeight: 20,
  },
  charCount: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#828282',
    textAlign: 'right',
  },

  /* 구분선 */
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 0,
  },

  /* 카테고리 / 사진 추가 행 */
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    height: 49,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  addRowIcon: { width: 31, height: 31 },
  addRowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
  },
  addRowCount: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#51E92B',
    marginRight: 4,
  },
  addRowChevron: {
    width: 10,
    height: 18,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 15,
  },

  /* 작성 버튼 */
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

  /* 위치 검색 드롭다운 */
  locationDropdown: {
    position: 'absolute',
    left: 15,
    right: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 10,
    maxHeight: 336,
  },
  locationResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    minHeight: 59,
  },
  locationResultItemFirst: {
    backgroundColor: 'rgba(217, 217, 217, 0.8)',
  },
  locationResultPin: {
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  locationResultInfo: {
    flex: 1,
    gap: 2,
  },
  locationResultAddress: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#595959',
  },
  locationResultCategory: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#828282',
    flexShrink: 0,
  },

  /* 작성 완료 화면 */
  completeScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 273,
  },
  completeImage: {
    width: 139,
    height: 139,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#000000',
    lineHeight: 35,
    marginBottom: 7,
  },
  completeSub: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#828282',
    lineHeight: 21,
  },

  /* 작성 확인 다이얼로그 */
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBox: {
    width: 251,
    height: 115,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  alertTitleArea: {
    height: 81,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#0B0B0B',
    lineHeight: 22,
  },
  alertDividerH: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  alertButtons: {
    flexDirection: 'row',
    height: 34,
  },
  alertBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDividerV: {
    width: 1,
    backgroundColor: '#D9D9D9',
  },
  alertBtnCancel: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
  },
  alertBtnConfirm: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#51E92B',
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

const catStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  handleArea: {
    paddingBottom: 4,
  },
  sheet: {
    width: '100%',
    height: 660,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
  },
  handle: {
    width: 51,
    height: 5,
    backgroundColor: '#8E8E93',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchIcon: { width: 24, height: 24 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 10,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabOn: { backgroundColor: '#51E92B' },
  filterTabText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
  },
  catList: { maxHeight: 400 },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingRight: 16,
    backgroundColor: '#FFFFFF',
  },
  catRowSelected: { backgroundColor: 'rgba(217,217,217,0.6)' },
  catRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    gap: 10,
    height: '100%',
  },
  catName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
  },
  chevron: { width: 21, height: 21 },
  starButton: { padding: 8 },
  star: { width: 24, height: 24 },
  addButtonWrapper: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
  },
  addButton: {
    width: 327,
    height: 40,
    backgroundColor: '#85EB6C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
    lineHeight: 20,
  },
});

const photoStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    width: '100%',
    height: 620,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
  },
  handleArea: {
    paddingBottom: 4,
  },
  handle: {
    width: 51,
    height: 5,
    backgroundColor: '#8E8E93',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  grid: {
    maxHeight: 470,
  },
  gridContent: {
    paddingHorizontal: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#28AE06',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  addButtonWrapper: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
  },
  addButton: {
    width: 327,
    height: 40,
    backgroundColor: '#85EB6C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#000000',
    lineHeight: 20,
  },
});
