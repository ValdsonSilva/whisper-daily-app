// src/screens/LanguageSelectionScreen.tsx
import React, { useEffect, useState, useTransition } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { pallete } from "../theme/palette";
import { getHealth } from "../api/getHealth";
import type { HealthResponse } from "../api/getHealth";
import { LanguageCode, registerAnonymous } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";
import { setAppLanguage, SupportedLang } from "../i18n";
import { registerForPush } from "../service/notifications";
import api from "../service/api";

type LanguageOption = {
    code: LanguageCode;
    label: string;
};

type Props = {
    onSelectLanguage?: (code: string) => void;
};

const LANGUAGES: LanguageOption[] = [
    { code: "en_US" as const, label: "English" },
    { code: "pt_BR" as const, label: "Portuguese" },
];

export default function LanguageSelectionScreen({ onSelectLanguage }: Props) {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [locale, setLocale] = useState<LanguageCode>('es_ES');
    const { t, i18n } = useTranslation();

    // health check da api
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await getHealth();
                setHealth(response);
                console.log("Response: ", response);
            } catch (err) {
                console.error(err);
                setError("Erro ao consultar API");
                console.log("Response error: ", err);
            }
        };

        fetch();
    }, []);


    const handlePress = async (code: LanguageCode) => {
        try {
            setLocale(code);
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
            const response = await registerAnonymous({ locale: code, timeZone });
            console.log("User response:", response);

            if (code === 'en_US') {
                setAppLanguage('en')
                await AsyncStorage.setItem("language", "en");
            } else {
                setAppLanguage(code as SupportedLang)
                await AsyncStorage.setItem("language", code);
            }

            await AsyncStorage.setItem("token", response.token);
            await AsyncStorage.setItem("userId", response.userId);

            router.push("/home");
        } catch (err) {
            console.log("Erro ao registrar anônimo:", err);
        }
    };


    return (
        <LinearGradient
            colors={[pallete.main_bg, pallete.white]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.title}>Choose your{"\n"}language</Text>
                </View>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: 25 }}>{"<"}</Text>
                </TouchableOpacity>

                <View style={styles.buttonsContainer}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={() => handlePress(lang.code)}
                        >
                            <Text style={styles.buttonText}>{lang.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 32,
    },
    header: {
        marginTop: 80,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1.1,
        color: "#111827",
    },
    buttonsContainer: {
        marginTop: 60,
        gap: 18,
        alignItems: "center",
    },
    button: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },
});
