import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { registerForPush } from "../service/notifications";
import api from "../service/api";


export default function Home() {

    const { t } = useTranslation("home");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const verifyCacheData = async () => {
            const data = await AsyncStorage.getAllKeys();
            const cachedUserId = await AsyncStorage.getItem("userId")
            setUserId(cachedUserId);
            console.log("Cached data keys: ", data);
        }

        verifyCacheData();
    }, []);

    useEffect(() => {
        if (!userId) return;

        (async () => {
            const token = await registerForPush();
            if (!token) return;

            await api.post("/push/devices", {
                token: token.token,
                platform: token.platform,
            });
        })();
    }, [userId]);

    return (
        <LinearGradient
            colors={[pallete.main_bg, "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Logo */}
                <View style={styles.logoWrapper}>
                    <Image
                        source={require("../images/whisper-logo.png")}
                        resizeMode="contain"
                        width={234}
                        height={234}
                    />
                    <Text style={styles.logo}>WhisperDaily</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        {/* Bring quiet reflection{"\n"}to your day. */}
                        {t("title")}
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={() => router.push("/dailyGoal")}
                    >
                        <Text style={styles.buttonText}>{t("button.whisper")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={() => router.push("/blocknotes")}
                    >
                        <Text style={styles.buttonText}>{t("button.notas")}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>{t("footer")}</Text>
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
        paddingHorizontal: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    logoWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        fontSize: 36,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        color: "#041016",
        marginBottom: 32,
        fontWeight: "600",
    },
    button: {
        width: 254,
        height: 57,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: pallete.main_bg,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    footerText: {
        fontSize: 14,
        color: "#041016",
        textAlign: "center",
        marginBottom: 40,
    },
});
