// src/screens/OnboardingListenScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  onNext?: () => void;
};

export default function OnboardingFirst({ onNext }: Props) {

  return (
    <LinearGradient
      colors={[pallete.main_bg, "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Logo / Marca */}
        <View style={styles.logoWrapper}>
          {/* Troque o require pelo caminho real do seu logo */}
          <Image
            source={require("../images/whisper-logo.png")}
            resizeMode="contain"
            width={234}
            height={234}
          />
        </View>

        {/* Conteúdo central */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Listen to yourself{"\n"}before you act
          </Text>

          <View style={styles.textBlock}>
            <Text style={styles.bodyText}>
              Track your progress, even on slow{"\n"}days.
            </Text>
            <Text style={[styles.bodyText, styles.bodySpacing]}>
              What matters is stay present.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => router.push("/onBoardingTwo")}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Forma decorativa inferior */}
        <View style={styles.bottomShapeWrapper}>
          <View style={styles.bottomShape} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  logoWrapper: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },

  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  textBlock: {
    marginTop: 40,
    marginBottom: 32,
  },
  bodyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#111827",
  },
  bodySpacing: {
    marginTop: 12,
  },

  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderRadius: 22,
    backgroundColor: pallete.main_bg,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  bottomShapeWrapper: {
    position: "absolute",
    bottom: -80,
    right: -40,
    width: 220,
    height: 160,
    overflow: "hidden",
  },
  bottomShape: {
    width: 260,
    height: 260,
    borderRadius: 180,
    backgroundColor: pallete.main_bg,
    opacity: 0.85,
    transform: [{ rotate: "-18deg" }],
  },
});
