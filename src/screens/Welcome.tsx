// src/screens/WelcomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";

type WelcomeScreenProps = {
  onBegin?: (event: GestureResponderEvent) => void;
};

export default function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={[pallete.white, pallete.main_bg]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Forma decorativa no topo */}
      <View style={styles.topShapeWrapper}>
        <View style={styles.topShape} />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to{"\n"}your personal{"\n"}space
        </Text>

        <View style={styles.subtitleWrapper}>
          <Text style={styles.subtitle}>
            Your journey toward mindful{"\n"}
            progress begins now.
          </Text>

          <Text style={[styles.subtitle, styles.subtitleSpacing]}>
            Take it one breath at a time
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onBegin}>
          <Text style={styles.buttonText}>Begin exploring</Text>
        </TouchableOpacity>
      </View>

      {/* Texto inferior */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember consistency{"\n"}
          is calm, not rush.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topShapeWrapper: {
    position: "absolute",
    top: -80,
    left: -40,
    right: 0,
    height: 200,
    overflow: "hidden",
  },
  topShape: {
    width: 260,
    height: 260,
    borderRadius: 200,
    borderWidth: 26,
    borderColor: "#6BE08F",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "-20deg" }],
    opacity: 0.7,
  },

  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "600",
    color: "#5F8F7D",
    letterSpacing: 0.5,
  },

  subtitleWrapper: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#1F2933",
  },
  subtitleSpacing: {
    marginTop: 12,
  },

  button: {
    backgroundColor: pallete.main_bg,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },

  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
    color: "#111827",
  },
});
