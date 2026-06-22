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
import MainScreen from "@/components/main-screen";
import LikeScreen from "@/components/like-screen";
import LoginScreen from "@/components/login-screen";
import SignUpScreen from "@/components/signup-screen";
import { SplashScreen as SplashScreenComponent } from "@/components/splash-screen";
import RestaurantScreen from "@/components/restaurant-screen";
import LookScreen from "@/components/look-screen";
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

type AppState =
  | "splash"
  | "login"
  | "signup"
  | "category"
  | "app"
  | "like"
  | "restaurant"
  | "look"
  | "mypage"
  | "customer"
  | "myinfo"
  | "password-change"
  | "notification"
  | "follow"
  | "bell-notification"
  | "settings"
  | "terms"
  | "withdrawal";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [appState, setAppState] = useState<AppState>("app");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded] = useFonts({
    Modak: Modak_400Regular,
    Jua: Jua_400Regular,
    Inter: Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // useEffect(() => {
  //   const splashTimer = setTimeout(() => {
  //     setAppState('login');
  //   }, 2000);
  //   return () => clearTimeout(splashTimer);
  // }, []);

  // useEffect(() => {
  //   const splashTimer = setTimeout(() => {
  //     setAppState('login');
  //   }, 2000);
  //   return () => clearTimeout(splashTimer);
  // }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAppState("app");
  };

  const handleSignUpSuccess = () => {
    setAppState("category");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {appState === "splash" && <SplashScreenComponent />}
      {appState === "login" && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} onSignUp={() => setAppState("signup")} />
      )}
      {appState === "signup" && (
        <SignUpScreen onSignUpSuccess={handleSignUpSuccess} onBack={() => setAppState("login")} />
      )}
      {appState === "category" && (
        <CategoryScreen onConfirm={() => { setIsLoggedIn(true); setAppState("app"); }} />
      )}
      {appState === "app" && (
        <MainScreen
          onCategoryPress={(id) => { if (id === 'restaurant') setAppState('restaurant'); }}
          onLookPress={() => setAppState('look')}
          onLikePress={() => setAppState('like')}
          onMyPress={() => setAppState('mypage')}
        />
      )}
      {appState === "like" && (
        <LikeScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "restaurant" && (
        <RestaurantScreen
          onBack={() => setAppState("app")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "look" && (
        <LookScreen
          onBack={() => setAppState("app")}
          onHomePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "mypage" && (
        <MyPageScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
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
      {appState === "settings" && (
        <SettingsScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
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
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "withdrawal" && (
        <WithdrawalScreen
          onBack={() => setAppState("settings")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onConfirmWithdrawal={() => { setIsLoggedIn(false); setAppState("login"); }}
        />
      )}
      {appState === "follow" && (
        <FollowScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "notification" && (
        <NotificationScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "bell-notification" && (
        <NotificationBellScreen
          onBack={() => setAppState("mypage")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
      {appState === "customer" && (
        <CustomerCenterScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onWritePress={() => setAppState("app")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onBack={() => setAppState("mypage")}
        />
      )}
      {appState === "myinfo" && (
        <MyInfoScreen
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
          onPasswordPress={() => setAppState("password-change")}
          onBack={() => setAppState("mypage")}
        />
      )}
      {appState === "password-change" && (
        <PasswordChangeScreen
          onBack={() => setAppState("myinfo")}
          onHomePress={() => setAppState("app")}
          onLookPress={() => setAppState("look")}
          onLikePress={() => setAppState("like")}
          onMyPress={() => setAppState("mypage")}
        />
      )}
    </ThemeProvider>
  );
}
