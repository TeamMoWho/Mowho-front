/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    green: "#22c55e",
    primary: "#85EB6C",
    primaryDark: "#65C744",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    green: "#16a34a",
    primary: "#7FD956",
    primaryDark: "#5FB840",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "Modak",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "Modak",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "Modak",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "Menlo",
  },
  android: {
    sans: "Modak",
    serif: "Modak",
    rounded: "Modak",
    mono: "monospace",
  },
  default: {
    sans: "Modak",
    serif: "Modak",
    rounded: "Modak",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
