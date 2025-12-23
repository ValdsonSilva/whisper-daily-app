import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette";  // Suponho que seja o arquivo de tema
import { listRitualsByStatus } from "../api/ritual-list-status";
import { Ritual, RitualStatus } from "../api/ritual-list-user";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GoalsGardenScreen() {
    const [selectedTab, setSelectedTab] = useState<RitualStatus>(RitualStatus.PLANNED);
    const [rituals, setRituals] = useState<Ritual[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Função para carregar os rituais quando o status mudar
        const fetchRituals = async () => {
            setLoading(true);
            console.log("Entrou")
            try {
                const userId = await AsyncStorage.getItem("userId") ?? "";

                const response = await listRitualsByStatus({
                    userId: userId as any, // Passe o userId correto
                    status: selectedTab,
                    take: 10, // Exemplo de "take", você pode ajustar conforme necessidade
                    order: "asc", // Exemplo de ordem
                });
                setRituals(response.items);
                console.log(response)
            } catch (err) {
                setError("Erro ao carregar os rituais.");
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchRituals();
    }, [selectedTab]); // Atualiza quando mudar o status selecionado

    const renderStatusLabel = (status: RitualStatus) => {
        switch (status) {
            case "PLANNED":
                return "Planned";
            case "COMPLETED":
                return "Done";
            case "MISSED":
                return "Missed";
            default:
                return status;
        }
    };

    return (
        <LinearGradient
            colors={[pallete.main_bg, pallete.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Your goals garden</Text>
                        <Text style={styles.subtitle}>
                            Every goal you nurture laces{"\n"}something blooming behind.
                        </Text>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <View style={styles.tabsRow}>
                            <TabButton
                                label="Planned"
                                isActive={selectedTab === "PLANNED"}
                                onPress={() => setSelectedTab(RitualStatus.PLANNED)}
                            />
                            <TabButton
                                label="Missed"
                                isActive={selectedTab === "MISSED"}
                                onPress={() => setSelectedTab(RitualStatus.MISSED)}
                            />
                            <TabButton
                                label="Done"
                                isActive={selectedTab === "COMPLETED"}
                                onPress={() => setSelectedTab(RitualStatus.COMPLETED)}
                            />
                        </View>
                        <View style={styles.tabsDivider} />
                    </View>

                    {/* Goals list */}
                    <View style={styles.goalsList}>
                        {loading && <Text style={styles.loading}>Loading...</Text>}
                        {error && <Text style={styles.error}>{error}</Text>}
                        {rituals.map((ritual) => (
                            <View key={ritual.id} style={styles.goalCard}>
                                <Text style={styles.goalText}>{ritual.title}</Text>
                                <View style={styles.statusPill}>
                                    <Text style={styles.statusText}>{renderStatusLabel(ritual.status)}</Text>
                                </View>
                            </View>
                        ))}
                        {rituals.length === 0 && !loading && !error && (
                            <Text style={styles.emptyText}>No goals in this section yet.</Text>
                        )}
                    </View>

                    <Text style={styles.footerMessage}>Let your intentions bloom</Text>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom nav (UI) */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                        <Text style={styles.navIcon}>🏠</Text>
                        <Text style={styles.navLabel}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/whisper-chat-ai')}>
                        <Text style={styles.navIcon}>💬</Text>
                        <Text style={styles.navLabel}>Whisper</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

type TabButtonProps = {
    label: string;
    isActive: boolean;
    onPress: () => void;
};

function TabButton({ label, isActive, onPress }: TabButtonProps) {
    return (
        <TouchableOpacity style={styles.tabButton} onPress={onPress}>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {label}
            </Text>
            {isActive && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
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
        paddingTop: 32,
        paddingBottom: 16,
    },

    header: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: pallete.white,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 14,
        textAlign: "center",
        color: "#E5E7EB",
    },

    tabsContainer: {
        marginBottom: 16,
    },
    tabsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
    },
    tabLabel: {
        fontSize: 14,
        color: "#4B5563",
    },
    tabLabelActive: {
        color: "#111827",
        fontWeight: "600",
    },
    tabUnderline: {
        marginTop: 8,
        width: "40%",
        height: 2,
        borderRadius: 999,
        backgroundColor: "#4B5563",
    },
    tabsDivider: {
        marginTop: 6,
        height: 1,
        backgroundColor: "#D1D5DB",
    },

    goalsList: {
        marginTop: 16,
        gap: 16,
    },
    goalCard: {
        backgroundColor: pallete.white,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    goalText: {
        fontSize: 15,
        color: "#111827",
        flexShrink: 1,
        marginRight: 12,
    },
    statusPill: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "#6BA6B5",
        alignItems: "center",
        justifyContent: "center",
    },
    statusText: {
        fontSize: 13,
        color: pallete.white,
        fontWeight: "500",
    },
    loading: {
        textAlign: "center",
        fontSize: 18,
        color: "#9CA3AF",
    },
    error: {
        textAlign: "center",
        fontSize: 16,
        color: "#F87171",
    },
    emptyText: {
        marginTop: 24,
        textAlign: "center",
        fontSize: 14,
        color: "#6B7280",
    },

    footerMessage: {
        marginTop: 32,
        textAlign: "center",
        fontSize: 14,
        color: "#4B5563",
    },

    bottomNav: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
        backgroundColor: pallete.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 8,
    },
    navItem: {
        alignItems: "center",
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
