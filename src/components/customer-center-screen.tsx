import { SymbolView } from 'expo-symbols';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
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

interface CustomerCenterProps {
    onHomePress?: () => void;
    onLookPress?: () => void;
    onWritePress?: () => void;
    onLikePress?: () => void;
    onMyPress?: () => void;
    onBack?: () => void;
}

export default function CustomerCenterScreen({
    onHomePress,
    onLookPress,
    onWritePress,
    onLikePress,
    onMyPress,
    onBack,
}: CustomerCenterProps) {
    const insets = useSafeAreaInsets();
    const navBottom = insets.bottom + NAV_MARGIN_BOTTOM;
    const scrollPaddingBottom = NAV_HEIGHT + navBottom + 36;

    const handleTabPress = (tabId: NavTabId) => {
        if (tabId === 'home') onHomePress?.();
        if (tabId === 'look') onLookPress?.();
        if (tabId === 'write') onWritePress?.();
        if (tabId === 'like') onLikePress?.();
        if (tabId === 'my') onMyPress?.();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <Text style={styles.title}>고객센터</Text>

                <View style={styles.listSection}>
                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <Text style={styles.listLabel}>고객센터 홈페이지 바로 가기</Text>
                        <View style={styles.arrowButton}>
                            <SymbolView
                                name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                                size={16}
                                tintColor="#000"
                                weight="bold"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={[styles.navWrapper, { bottom: navBottom }]} pointerEvents="box-none">
                <View style={styles.navBar}>
                    {NAV_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={styles.navItem}
                            onPress={() => handleTabPress(tab.id)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.navTabInner,
                                    tab.id === 'my' && styles.navTabInnerActive,
                                    tab.pb ? { paddingBottom: tab.pb } : null,
                                ]}
                            >
                                <View style={styles.navIconBg}>
                                    <Image
                                        source={tab.image}
                                        style={{ width: tab.w, height: tab.h }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={[styles.navLabel, tab.id === 'my' && styles.navLabelActive]}>
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
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
    title: {
        marginTop: 52,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Inter-Bold',
        color: '#000000',
        lineHeight: 28,
    },
    backButton: {
        position: 'absolute',
        top: 48,
        left: 6,
        zIndex: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    backButtonText: {
        fontSize: 26,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        color: '#000000',
        lineHeight: 30,
    },
    listSection: { marginTop: 28 },
    listItem: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    listLabel: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'Inter-Bold',
        color: '#000000',
    },
    arrowButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },

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
        color: '#000000',
    },
    navLabelActive: { fontWeight: '300' },
});
