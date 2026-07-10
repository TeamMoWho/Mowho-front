import { Modak_400Regular } from "@expo-google-fonts/modak";
import { Jua_400Regular } from "@expo-google-fonts/jua";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import CategoryScreen from "@/components/category-screen";
import HomeScreen from "@/components/home-screen";
import LoginScreen from "@/components/login-screen";
import SignUpScreen from "@/components/signup-screen";
import { SplashScreen as SplashScreenComponent } from "@/components/splash-screen";
import RestaurantScreen from "@/components/restaurant-screen";
import CafeScreen from "@/components/cafe-screen";
import MovieScreen from "@/components/movie-screen";
import StayScreen from "@/components/stay-screen";
import CosmeticScreen from "@/components/cosmetic-screen";
import TravelScreen from "@/components/travel-screen";
import BookScreen from "@/components/book-screen";
import ClothesScreen from "@/components/clothes-screen";
import ElectronicsScreen from "@/components/electronics-screen";
import EtcScreen from "@/components/etc-screen";
import LookScreen from "@/components/look-screen";
import BannerDetailScreen from "@/components/banner-detail-screen";
import WriteScreen from "@/components/write-screen";
import WriteReviewScreen from "@/components/write-review-screen";
import MyPageScreen from "@/components/my-page-screen";
import MyInfoScreen from "@/components/my-info-screen";
import PasswordChangeScreen from "@/components/password-change-screen";
import CustomerCenterScreen from "@/components/customer-center-screen";
import NotificationScreen from "@/components/notification-screen";
import FollowScreen from "@/components/follow-screen";
import NotificationBellScreen from "@/components/notification-bell-screen";
import SettingsScreen from "@/components/settings-screen";
import TermsPolicyScreen from "@/components/terms-policy-screen";
import WithdrawalScreen from "@/components/withdrawal-screen";
import LikeScreen from "@/components/like-screen";

type AppState =
  | "splash" | "login" | "signup" | "category" | "app" | "look" | "write" | "writeReview"
  | "restaurant" | "cafe" | "movie" | "stay" | "cosmetic"
  | "travel" | "book" | "clothes" | "electronics" | "etc"
  | "bannerDetail"
  | "like"
  | "mypage" | "myinfo" | "password-change" | "customer"
  | "notification" | "follow" | "bell-notification"
  | "settings" | "terms" | "withdrawal";

const APP_STATE_BY_TAB: Partial<Record<string, AppState>> = {
  home: 'app',
  look: 'look',
  write: 'write',
  like: 'like',
  my: 'mypage',
};

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [appState, setAppState] = useState<AppState>("app");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(0);
  const [fontsLoaded] = useFonts({
    Modak: Modak_400Regular,
    Jua: Jua_400Regular,
    Inter: Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const handleNavigate = (tabId: string) => {
    const next = APP_STATE_BY_TAB[tabId];
    if (next) setAppState(next);
  };

  const handleCategoryPress = (id: string) => {
    setAppState(id as AppState);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAppState("app");
  };

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {appState === "splash"    && <SplashScreenComponent />}
      {appState === "login"     && <LoginScreen onLoginSuccess={handleLoginSuccess} onSignUp={() => setAppState("signup")} />}
      {appState === "signup"    && <SignUpScreen onSignUpSuccess={() => setAppState("category")} onBack={() => setAppState("login")} />}
      {appState === "category"  && <CategoryScreen onConfirm={() => { setIsLoggedIn(true); setAppState("app"); }} />}
      {appState === "app"       && <HomeScreen onCategoryPress={handleCategoryPress} onNavigate={handleNavigate} onBannerPress={(idx) => { setSelectedBanner(idx); setAppState("bannerDetail"); }} />}
      {appState === "bannerDetail" && <BannerDetailScreen bannerIndex={selectedBanner} onNavigate={handleNavigate} />}
      {appState === "look"      && <LookScreen onNavigate={handleNavigate} />}
      {appState === "write"     && <WriteScreen onNavigate={handleNavigate} onWriteReview={() => setAppState("writeReview")} />}
      {appState === "writeReview" && <WriteReviewScreen onBack={() => setAppState("write")} onNavigate={handleNavigate} />}
      {appState === "restaurant"  && <RestaurantScreen onNavigate={handleNavigate} />}
      {appState === "cafe"        && <CafeScreen onNavigate={handleNavigate} />}
      {appState === "movie"       && <MovieScreen onNavigate={handleNavigate} />}
      {appState === "stay"        && <StayScreen onNavigate={handleNavigate} />}
      {appState === "cosmetic"    && <CosmeticScreen onNavigate={handleNavigate} />}
      {appState === "travel"      && <TravelScreen onNavigate={handleNavigate} />}
      {appState === "book"        && <BookScreen onNavigate={handleNavigate} />}
      {appState === "clothes"     && <ClothesScreen onNavigate={handleNavigate} />}
      {appState === "electronics" && <ElectronicsScreen onNavigate={handleNavigate} />}
      {appState === "etc"         && <EtcScreen onNavigate={handleNavigate} />}
      {appState === "like" && (
        <LikeScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "mypage" && (
        <MyPageScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onBellPress={() => setAppState("bell-notification")}
          onSettingsPress={() => setAppState("settings")}
          onMenuPress={(menuId) => {
            if (menuId === 'my-info') setAppState('myinfo');
            if (menuId === 'follow') setAppState('follow');
            if (menuId === 'notification') setAppState('notification');
            if (menuId === 'support') setAppState('customer');
          }}
        />
      )}
      {appState === "myinfo" && (
        <MyInfoScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onPasswordPress={() => setAppState("password-change")}
        />
      )}
      {appState === "password-change" && (
        <PasswordChangeScreen
          onBack={() => setAppState("myinfo")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "follow" && (
        <FollowScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "notification" && (
        <NotificationScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "bell-notification" && (
        <NotificationBellScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "customer" && (
        <CustomerCenterScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "settings" && (
        <SettingsScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onTermsPress={() => setAppState("terms")}
          onLogoutConfirm={() => { setIsLoggedIn(false); setAppState("login"); }}
          onWithdrawalPress={() => setAppState("withdrawal")}
        />
      )}
      {appState === "terms" && (
        <TermsPolicyScreen
          onBack={() => setAppState("settings")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "withdrawal" && (
        <WithdrawalScreen
          onBack={() => setAppState("settings")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("write")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onConfirmWithdrawal={() => { setIsLoggedIn(false); setAppState("login"); }}
        />
      )}
    </ThemeProvider>
  );
}
