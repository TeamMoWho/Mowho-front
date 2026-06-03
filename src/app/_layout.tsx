import { Modak_400Regular } from "@expo-google-fonts/modak";
import { Jua_400Regular } from "@expo-google-fonts/jua";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import LoginScreen from "@/components/login-screen";
import { SplashScreen as SplashScreenComponent } from "@/components/splash-screen";

type AppState = "splash" | "login" | "app";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [appState, setAppState] = useState<AppState>("splash");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded] = useFonts({
    Modak: Modak_400Regular,
    Jua: Jua_400Regular,
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

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setAppState('login');
    }, 2000);
    return () => clearTimeout(splashTimer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAppState("app");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {appState === "splash" && <SplashScreenComponent />}
      {appState === "login" && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
      {appState === "app" && (
        <>
          <AnimatedSplashOverlay />
          <AppTabs />
        </>
      )}
    </ThemeProvider>
  );
}
