import { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HORIZONTAL_PADDING = 24;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP * 2) / 3;

const CATEGORIES = [
  { id: 'restaurant', label: '식당',    image: require('../../assets/images/categories/restaurant.png') },
  { id: 'cafe',       label: '카페',    image: require('../../assets/images/categories/cafe.png') },
  { id: 'movie',      label: '영화/OTT', image: require('../../assets/images/categories/movie.png') },
  { id: 'stay',       label: '숙박',    image: require('../../assets/images/categories/stay.png') },
  { id: 'cosmetic',   label: '코스메틱', image: require('../../assets/images/categories/cosmetic.png') },
  { id: 'travel',     label: '여행',    image: require('../../assets/images/categories/travel.png') },
  { id: 'book',       label: '독서',    image: require('../../assets/images/categories/book.png') },
  { id: 'clothes',    label: '옷',      image: require('../../assets/images/categories/clothes.png') },
  { id: 'electronics',label: '가전제품', image: require('../../assets/images/categories/electronics.png') },
];

interface CategoryProps {
  onConfirm?: (selected: string[]) => void;
}

export default function CategoryScreen({ onConfirm }: CategoryProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.titleText, styles.titleOutline, { top: -1 }]}>Category</Text>
            <Text style={[styles.titleText, styles.titleOutline, { top: 1 }]}>Category</Text>
            <Text style={[styles.titleText, styles.titleOutline, { left: -1 }]}>Category</Text>
            <Text style={[styles.titleText, styles.titleOutline, { left: 1 }]}>Category</Text>
            <Text style={styles.titleText}>Category</Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>사람들이 주로 찾는 카테고리에요</Text>
        <Text style={styles.subtitleLarge}>원하는 카테고리를 선택해주세요</Text>

        {/* 3×3 Grid */}
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Image source={cat.image} style={styles.cardImage} resizeMode="contain" />
                <Text style={styles.cardLabel}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 확인 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirm?.(selected)}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 24,
  },
  titleWrapper: {
    position: 'relative',
  },
  titleText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    fontFamily: 'Modak',
  },
  titleOutline: {
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.7)',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.8,
    marginTop: 30,
  },
  subtitleLarge: {
    fontSize: 23,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#51E92B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    gap: 6,
  },
  cardSelected: {
    backgroundColor: '#D4F5C8',
    borderColor: Colors.light.primaryDark,
    borderWidth: 2,
  },
  cardEmoji: {
    fontSize: 30,
  },
  cardImage: {
    width: 51,
    height: 51,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: Colors.light.primary,
  },
  confirmButton: {
    backgroundColor: '#2BB509',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
  },
});
