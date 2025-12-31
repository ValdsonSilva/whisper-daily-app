// src/screens/OnboardingStepsScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// ajuste o caminho do pallete conforme seu projeto
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"


type Props = {
    onNext?: () => void;
};

export default function OnboardingTwo({ onNext }: Props) {
    return (
        <LinearGradient
            colors={[pallete.main_bg, "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Small steps.\nSteady rythm
                    </Text>

                    <View style={styles.textBlock}>
                        <Text style={styles.bodyText}>
                            Celebrate each step and\n
                            feel inspired by your own rythm.
                        </Text>
                    </View>

                    {/* Ícone de passos (simples com emoji, você pode trocar por SVG/Imagem depois) */}
                    <View style={styles.stepsIconWrapper}>
                        <Text style={styles.stepsEmoji}>👣</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={() => router.push("/onBoardingThree")}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
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
        marginTop: 32,
        marginBottom: 32,
    },
    bodyText: {
        fontSize: 14,
        textAlign: "center",
        color: "#111827",
    },

    stepsIconWrapper: {
        marginBottom: 40,
    },
    stepsEmoji: {
        fontSize: 56,
        color: "#FFFFFF",
    },

    button: {
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
});
