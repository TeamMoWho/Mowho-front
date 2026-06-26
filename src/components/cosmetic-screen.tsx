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

interface cosmeticScreenProps {
  onNavigate?: (tabId: string) => void;
}

export default function cosmeticScreen({ onNavigate }: cosmeticScreenProps) {
  const insets = useSafeAreaInsets();
  const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
  const scrollPaddingBottom = NAV_HEIGHT + navBottom + 20;
  const [searchText, setSearchText] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate?.('home')} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="코스메틱 후기를 검색해보세요"
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
        <View style={styles.titleBlock}>
          <Image source={require('../../assets/images/categories/cosmetic.png')} style={styles.titleIcon} resizeMode="contain" />
          <View style={styles.titleTextBlock}>
            <Text style={styles.titleText}>코스메틱 카테고리를 추천드려요</Text>
          </View>
        </View>

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
      </ScrollView>

      <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_TABS.map((tab) => (
            <TouchableOpacity key={tab.id} style={styles.navItem} activeOpacity={0.7} onPress={() => onNavigate?.(tab.id)}>
              <View style={[styles.navTabInner, tab.id === 'home' && styles.navTabInnerActive, (tab as any).pb ? { paddingBottom: (tab as any).pb } : null]}>
                <View style={styles.navIconBg}>
                  <Image source={tab.image} style={{ width: tab.w, height: tab.h }} resizeMode="contain" />
                </View>
                <Text style={[styles.navLabel, tab.id === 'home' && styles.navLabelActive]}>{tab.label}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 8 },
  backButton: { padding: 4 },
  backArrow: { fontSize: 22, fontWeight: '600', color: '#000', fontFamily: 'Inter-SemiBold' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter', color: '#000' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingHorizontal: 15 },
  titleBlock: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginBottom: 14 },
  titleIcon: { width: 44, height: 44 },
  titleTextBlock: { paddingTop: 8 },
  titleText: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000000', lineHeight: 25 },
  titleSub: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#595959', lineHeight: 14 },
  card: { backgroundColor: '#F5F5F5', borderRadius: 10, marginBottom: 16, paddingTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 },
  cardEmpty: { borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 10 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { width: 24, height: 24 },
  moreIcon: { fontSize: 13, color: '#555', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#5C5C5C', marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8, gap: 8 },
  avatarCircleSkeleton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D0D0D0' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 4, marginBottom: 10 },
  starIcon: { fontSize: 12, lineHeight: 14 },
  starEmpty: { color: '#D0D0D0' },
  photoPlaceholder: { height: 151, marginHorizontal: 12, borderRadius: 6, backgroundColor: '#D0D0D0', alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { fontSize: 13, color: '#888' },
  skeletonName: { width: 100, height: 18, borderRadius: 4, backgroundColor: '#D0D0D0', marginBottom: 4 },
  skeletonLine: { height: 10, borderRadius: 4, backgroundColor: '#D0D0D0', width: 200 },
  navWrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  navBar: { width: 325, height: NAV_HEIGHT, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 32, borderWidth: 1, borderColor: '#51E92B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navTabInner: { width: 60, height: 46, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingTop: 4, paddingBottom: 15, marginHorizontal: -0.2 },
  navTabInnerActive: { backgroundColor: 'rgba(133, 235, 108, 0.5)' },
  navIconBg: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { position: 'absolute', bottom: 3, fontSize: 10, fontWeight: '300', fontFamily: 'Inter', color: '#000' },
  navLabelActive: { fontWeight: '300' },
});
