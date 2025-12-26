// src/screens/OnboardingGoalsScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// ajuste o caminho conforme o seu projeto
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"


type Props = {
    onNext?: () => void;
};

export default function OnboardingGoalsScreen({ onNext }: Props) {
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
                        Have your goals{"\n"}well defined.
                    </Text>

                    <View style={styles.textBlock}>
                        <Text style={styles.bodyText}>
                            Make your routine{"\n"}
                            lighter without feel tired.
                        </Text>
                    </View>

                    {/* Ícone de plantinha (pode trocar por SVG/Imagem depois) */}
                    <View style={styles.plantWrapper}>
                        <Text style={styles.plantEmoji}>🌱</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={() => router.push("/language")}
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

    plantWrapper: {
        marginBottom: 40,
    },
    plantEmoji: {
        fontSize: 52,
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
