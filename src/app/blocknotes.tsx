import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette"; // Ajuste o caminho do pallete se necessário
import { listNotes } from "../api/notes/notes-list-user";
import { Note } from "../api/notes/notes-create";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigation from "../components/bottom-navigation/bottom-navigation";
import ScreenContextMenu, { ScreenContextMenuItem } from "../components/ScreenContextMenu";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import groupNotesByMonth from "../utils/groupNotesByMonth";
import { formatDateString } from "../utils/formatDate";
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { getDeviceLanguage } from "../i18n";

type NoteWithCreatedAt = Note & { createdAt: string | Date };

export default function BlockNotes() {
    const { refresh } = useLocalSearchParams();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [searchText, setSearchText] = useState("");
    const [total, setTotal] = useState<number | null>(null);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const { t } = useTranslation("blockNotes");


    const menuItems: ScreenContextMenuItem[] = [
        { label: t("label"), icon: "📝", onPress: () => router.push("/noteEditor") }
    ];

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = await AsyncStorage.getItem("userId");

            if (!userId) {
                throw new Error(t("errorMessages.first"));
            }

            const notes = await listNotes();

            if (notes.items.length === 0) setMessage(t("messages"));
            if (!notes) throw new Error(t("errorMessages.second"));

            setNotes(notes.items);
            setFilteredNotes(notes.items);
            setTotal(notes.total);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                Alert.alert("Erro: ", err.message)
            } else {
                setError(t("errorMessages.third"));
            }
            console.log("erro: ", err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [])

    useFocusEffect(
        useCallback(() => {
            let active = true;

            (async () => {
                if (!active) return;
                await fetchNotes();
            })();

            return () => {
                active = false;
            };
        }, [])
    );


    useEffect(() => {
        if (searchText.trim()) {
            setFilteredNotes(
                notes.filter((note) =>
                    note.content.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        } else {
            setFilteredNotes(notes); // Se a pesquisa estiver vazia, retorna todas as notas
        }
    }, [searchText, notes]);

    return (
        <ScreenContextMenu items={menuItems}>
            <LinearGradient colors={[pallete.main_bg, "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.gradient}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Ionicons name="arrow-back" color={"#fff"} size={20} onPress={() => router.back()}/>
                        {/* <Text style={styles.headerText}>{t("headerText")}</Text> */}
                        {/* <Text style={styles.sharedText}>Shared</Text> */}
                    </View>

                    <View>
                        <Text style={styles.headerText}>{t("headerText")}</Text>
                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t("placeHolder")}
                                placeholderTextColor="#9CA3AF"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>

                    {/* Notes List Grouped by Month */}
                    <ScrollView contentContainerStyle={styles.notesList}>
                        {loading && <Text style={styles.loading}>{t("loading")}</Text>}
                        {error && <Text style={styles.error}>{error}</Text>}
                        {message && <Text style={styles.message}>{message}</Text>}

                        {(() => {
                            const validNotes = notes.filter(
                                (n): n is NoteWithCreatedAt => !!n.createdAt
                            );
                            const { groups, orderedKeys } = groupNotesByMonth(validNotes);

                            if (!loading && !error && orderedKeys.length === 0) {
                                return <Text style={styles.emptyText}>{t("emptyText")}</Text>;
                            }

                            return orderedKeys.map((month) => (

                                <View key={month}>
                                    <Text style={styles.monthTitle}>{month}</Text>

                                    <View>
                                        {groups[month].map((note: any) => (
                                            <View key={note.id} style={styles.noteCard}>
                                                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Ionicons name="open-outline"
                                                        size={25}
                                                        color={"#000"}
                                                        style={{ textAlign: "right" }}
                                                        onPress={() => router.push({
                                                            pathname: "/noteEditor",
                                                            params: { id: note.id }
                                                        })}
                                                    />

                                                    <Text style={[styles.noteText, { fontWeight: "bold", fontSize: 16 }]} numberOfLines={1}>
                                                        {note.title ?? "Title of the notes"}
                                                    </Text>
                                                </View>

                                                <View style={styles.noteFooter}>
                                                    <Text style={styles.dateText}>
                                                        {formatDateString(note.createdAt.toLocaleString())}
                                                    </Text>
                                                    <Text style={styles.noteText} numberOfLines={1}>
                                                        {note.content}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ));
                        })()}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={{ color: "#fff" }}>{total ? `${total} ${t("headerText")}` : "..."}</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </ScreenContextMenu>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    headerText: {
        fontSize: 28,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    sharedText: {
        fontSize: 20,
        color: "#FFFFFF",
        marginTop: 5,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#F4F4F4",
        fontSize: 14,
        color: "#111827",
    },
    notesList: {
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
        marginTop: 20,
    },
    noteCard: {
        flex: 1,
        // flexDirection: "column",
        justifyContent: "space-around",
        // alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        // marginBottom: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    noteText: {
        fontSize: 12,
        color: "#111827",
        marginRight: 10,
        flexWrap: "nowrap"
    },
    noteFooter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
    },
    dateText: {
        fontSize: 12,
        color: "#9CA3AF",
        marginLeft: 10,
    },
    emoji: {
        fontSize: 18,
    },
    emptyText: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 10,
    },
    addButton: {
        backgroundColor: pallete.main_bg,
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 14,
        color: "#FFFFFF",
    },
    loading: {
        textAlign: "center",
        fontSize: 18,
        color: "#9CA3AF",
    },
    message: {
        textAlign: "center",
        fontSize: 18,
        color: "#f8f8f8ff",
    },
    error: {
        textAlign: "center",
        fontSize: 16,
        color: "#F87171",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        height: 113,
        backgroundColor: "#BFCFE6",
        color: "#fff",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
