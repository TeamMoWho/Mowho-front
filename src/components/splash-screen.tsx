import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={[styles.text, styles.outlineText, { top: -1 }]}>MoWho</Text>
        <Text style={[styles.text, styles.outlineText, { top: 1 }]}>MoWho</Text>
        <Text style={[styles.text, styles.outlineText, { left: -1, right: 1 }]}>MoWho</Text>
        <Text style={[styles.text, styles.outlineText, { left: 1, right: -1 }]}>MoWho</Text>
        <Text style={styles.text}>MoWho</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    position: "relative",
  },
  text: {
    fontFamily: "Modak",
    fontWeight: "400",
    fontSize: 85,
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  outlineText: {
    position: "absolute",
    color: "rgba(0, 0, 0, 0.7)",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});
