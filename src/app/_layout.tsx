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
import LoginScreen from "@/components/login-screen";
import SignUpScreen from "@/components/signup-screen";
import { SplashScreen as SplashScreenComponent } from "@/components/splash-screen";

type AppState = "splash" | "login" | "signup" | "category" | "app";

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
        <MainScreen />
      )}
    </ThemeProvider>
  );
}
