// src/screens/DailyGoalScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { upsertMorningRitual } from "../api/ritual/ritual-create";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";


type Props = {
    onConfirmGoal?: (goal: string) => void;
};

export default function DailyGoalScreen({ onConfirmGoal }: Props) {
    const [goal, setGoal] = useState("");
    const { t } = useTranslation("dailyGoal");

    async function handleSave() {
        if (!goal.trim()) return;

        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                Alert.alert("Erro", "Usuário não encontrado. Faça o onboarding novamente.");
                return;
            }

            const localDate = new Date().toISOString(); // manda ISO pro backend

            const response = await upsertMorningRitual({
                userId,
                localDate,
                title: goal,
                subtasks: [], // ou passe subtasks de verdade se tiver
            });

            console.log("Ritual salvo:", response.ritual);
            console.log("Resposta da IA:", response.aiReply);

            Alert.alert("Tudo certo ✨", response.aiReply);
            router.push("/goalsList");
        } catch (err) {
            console.log("Erro ao salvar ritual:", err);
            Alert.alert("Erro", "Não foi possível salvar o ritual.");
        }
    }


    const isDisabled = !goal.trim();

    return (
        <LinearGradient
            colors={[pallete.main_bg, pallete.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Forma orgânica no topo */}
                <View style={styles.topShapeWrapper}>
                    <View style={styles.topShape} />
                </View>

                <View style={styles.headerRow}>
                    <View />
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/goalsList")}>
                        {/* <Text style={styles.iconButtonText}>↗</Text> */}
                        <Text style={styles.iconButtonText}>{">"}</Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{t("title")}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t("placeholders")}
                            placeholderTextColor="#9CA3AF"
                            value={goal}
                            onChangeText={setGoal}
                            returnKeyType="done"
                        />

                        <TouchableOpacity
                            style={[styles.button, isDisabled && styles.buttonDisabled]}
                            activeOpacity={isDisabled ? 1 : 0.85}
                            onPress={handleSave}
                            disabled={isDisabled}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    isDisabled && styles.buttonTextDisabled,
                                ]}
                            >
                                {t("button")}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            {t("footer")}
                        </Text>
                    </View>
                </KeyboardAvoidingView>
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
    keyboardContainer: {
        flex: 1,
    },
    headerRow: {
        marginTop: 50,
        marginRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#B5F3D3",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#CFF8E2",
    },
    iconButtonText: {
        fontSize: 16,
    },

    topShapeWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 260,
        overflow: "hidden",
    },
    topShape: {
        position: "absolute",
        top: -120,
        left: -80,
        width: 420,
        height: 420,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 220,
        borderBottomLeftRadius: 220,
        borderBottomRightRadius: 120,
        backgroundColor: pallete.main_bg,
    },

    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: "600",
        color: pallete.white,
        textAlign: "center",
        marginBottom: 40,
    },

    input: {
        width: "100%",
        height: 62,
        backgroundColor: pallete.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: "#111827",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
    },

    button: {
        width: "100%",
        height: 62,
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: pallete.main_bg,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "600",
        color: pallete.white,
    },
    buttonTextDisabled: {
        color: "#E5E7EB",
    },

    footerText: {
        marginTop: 18,
        fontSize: 12,
        color: "#4B5563",
        textAlign: "center",
    },
});
