import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { listRituals, Ritual } from "../api/ritual-list-user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getGreeting } from "../utils/getGreeting";
import { LanguageCode } from "../api/auth";
import { registerRitualCheckIn } from "../api/ritual-checking";
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
    name?: string;
};

export default function GoalsList() {
    const [rituals, setRituals] = useState<Ritual[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLanguage, setUserLanguage] = useState<string | null>("");
    const [replyLoading, setReplyLoading] = useState<boolean>(false);


    useEffect(() => {
        async function loadRituals() {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) {
                    console.log("Sem userId salvo");
                    setError("Usuário não encontrado (sem userId salvo).");
                    Alert.alert("Usuário não encontrado.")
                    setLoading(false);
                    return;
                }
                const data = await listRituals(userId);
                console.log("Listagem: ", data);
                setRituals(data);
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    setRituals([])
                    setError("Nenhum ritual encontrado.");
                    console.log("Erro ao listar rituais:", err?.response?.data || err);
                } else {
                    console.log("Erro ao carregar rituais:", err?.response?.data || err);
                    setError("Erro ao carregar rituais.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadRituals();
    }, []);

    useEffect(() => {
        const getCachedUserLanguage = async () => {
            const userLanguage = await AsyncStorage.getItem("language") ?? "";
            return userLanguage;
        }
        const codeLanguage = getCachedUserLanguage();
        setUserLanguage(codeLanguage as any)
    }, [])

    async function handleMarkAsDone(userId: string) {
        try {
            setReplyLoading(true)
            const updated = await registerRitualCheckIn(userId, {
                achieved: true,
            });

            console.log("Ritual atualizado:", updated);
            Alert.alert(updated.aiReply as string)


        } catch (err: any) {
            console.log("Erro ao atualizar ritual:", err);
            Alert.alert("Erro ao atualizar ritual");
        } finally {
            setReplyLoading(false)
        }
    }

    return (
        <LinearGradient
            colors={[pallete.main_bg, pallete.white]}
            style={styles.gradient}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={true}
                >
                    {/* Header */}
                    <View style={styles.greeting}>
                        <View>
                            <Text style={styles.greetingText}>{getGreeting(userLanguage as LanguageCode)}</Text>
                            <View style={styles.greetingNameRow}>
                            </View>
                            <Text style={styles.subtitle}>
                                Let&apos;s move gently forward today.
                            </Text>
                        </View>
                        <View />
                    </View>

                    {/* Goal / Task Card */}
                    {loading ? (
                        <Text style={styles.loading}>...</Text>
                    ) : rituals.map((ritual) => (
                        <View style={styles.card} key={ritual.id}>
                            <Text style={styles.cardLabel}>Goal</Text>
                            <Text style={styles.cardGoalText}>{ritual.title}</Text>

                            {ritual.aiReply ? "" : (
                                <TouchableOpacity
                                    style={[
                                        styles.cardButton,
                                        replyLoading && styles.cardButtonDisabled,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => handleMarkAsDone(ritual.userId)}
                                    disabled={replyLoading}
                                >
                                    <Text style={styles.cardButtonText}>
                                        {replyLoading ? "Whisper is reflecting..." : "Mark as Done"}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Resposta da IA / estado de carregamento */}
                            {replyLoading && (
                                <View style={styles.aiReplyContainerLoading}>
                                    <Text style={styles.aiReplyLabel}>Whisper</Text>
                                    <Text style={styles.aiReplyText}>Thinking about your day...</Text>
                                </View>
                            )}

                            {!!ritual.aiReply && !replyLoading && (
                                <View style={styles.aiReplyContainer}>
                                    <View style={styles.aiReplyHeader}>
                                        <Text style={styles.aiReplyLabel}>Whisper</Text>
                                        <Text style={styles.aiReplyTag}>Reflection</Text>
                                    </View>
                                    <Text style={styles.aiReplyText}>{ritual.aiReply}</Text>
                                </View>
                            )}
                        </View>
                    ))}


                    {/* Stats card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>This week&apos;s calm consistency</Text>

                        <View style={styles.statRow}>
                            <Text style={styles.statIcon}>🌱</Text>
                            <Text style={styles.statLabel}>Goals completed</Text>
                            <View style={styles.spacer} />
                            <Text style={styles.statValue}>3/7</Text>
                        </View>

                        <View style={styles.statRow}>
                            <Text style={styles.statIcon}>✅</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                            <View style={styles.spacer} />
                            <Text style={styles.statValue}>4 days</Text>
                        </View>

                        <View style={styles.statRow}>
                            <Text style={styles.statIcon}>😊</Text>
                            <Text style={styles.statLabel}>Mood average</Text>
                            <View style={styles.spacer} />
                            <Text style={styles.statValue}>Peaceful</Text>
                        </View>
                    </View>

                    <Text style={styles.gardenText}>
                        Your garden is growing beautifully.
                    </Text>

                    {/* Espaço extra pro conteúdo não ficar escondido atrás da barra */}
                    <View style={{ height: 90 }} />
                </ScrollView>

                {/* Bottom Nav fake (somente UI) */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/goalsGardenScreen')}>
                        <Text style={styles.navIcon}>🌱</Text>
                        <Text style={styles.navLabel}>Goals</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.navItem}>
                        <Text style={styles.navIcon}>✨</Text>
                        <Text style={styles.navLabel}>Inspired</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/whisper-chat-ai')}>
                        <Text style={styles.navIcon}>💬</Text>
                        <Text style={styles.navLabel}>Whisper</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.navItem}>
                        <Text style={styles.navIcon}>👤</Text>
                        <Text style={styles.navLabel}>Profile</Text>
                    </TouchableOpacity> */}
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
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 12,
    },

    aiReplyContainer: {
        marginTop: 12,
        padding: 10,
        borderRadius: 14,
        backgroundColor: "#F1F5F9",
    },
    aiReplyContainerLoading: {
        marginTop: 12,
        padding: 10,
        borderRadius: 14,
        backgroundColor: "#E0EDFF",
    },
    aiReplyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    aiReplyLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#111827",
    },
    aiReplyTag: {
        marginLeft: 8,
        fontSize: 11,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: "#DBEAFE",
        color: "#1D4ED8",
    },
    aiReplyText: {
        fontSize: 13,
        color: "#374151",
        lineHeight: 18,
    },

    cardButtonDisabled: {
        opacity: 0.7,
    },

    loading: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "500",
        color: "#ffffffff",
        marginBottom: 16,
    },

    headerRow: {
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
    greeting: {
        marginTop: 40,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    greetingText: {
        fontSize: 24,
        fontWeight: "600",
        color: pallete.white,
    },
    greetingNameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    greetingName: {
        fontSize: 24,
        fontWeight: "600",
        color: "#041016",
        marginRight: 6,
    },
    sunEmoji: {
        fontSize: 22,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 14,
        color: pallete.white,
    },

    card: {
        marginTop: 24,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        paddingVertical: 18,
        paddingHorizontal: 18,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 5,
    },
    cardLabel: {
        fontSize: 12,
        color: "#A0A0A0",
        marginBottom: 4,
    },
    cardGoalText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
        marginBottom: 16,
    },
    cardButton: {
        marginTop: 4,
        borderRadius: 16,
        backgroundColor: "#F1F2F4",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cardButtonText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },

    section: {
        marginTop: 26,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#041016",
        marginBottom: 12,
    },
    moodRow: {
        flexDirection: "row",
        gap: 12,
    },
    moodButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    moodEmoji: {
        fontSize: 22,
    },

    cardTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "#041016",
        marginBottom: 16,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    statIcon: {
        width: 22,
        fontSize: 16,
        marginRight: 8,
    },
    statLabel: {
        fontSize: 14,
        color: "#111827",
    },
    spacer: {
        flex: 1,
    },
    statValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
    },

    gardenText: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 14,
        color: "#16353F",
    },

    bottomNav: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 8,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    navIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 11,
        color: "#4B5563",
    },
});
