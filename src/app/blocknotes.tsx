import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pallete } from "../theme/palette"; // Ajuste o caminho do pallete se necessário
import { listNotes } from "../api/notes-list-user";
import { Note } from "../api/notes-create";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigation from "../components/bottom-navigation/bottom-navigation";
import ScreenContextMenu, { ScreenContextMenuItem } from "../components/ScreenContextMenu";
import { router } from "expo-router";
import groupNotesByMonth from "../utils/groupNotesByMonth";
import { formatDateString } from "../utils/formatDate";

type NoteWithCreatedAt = Note & { createdAt: string | Date };

export default function BlockNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("")
    const [searchText, setSearchText] = useState("");
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

    const menuItems: ScreenContextMenuItem[] = [
        { label: "Write a note", icon: "📝", onPress: () => router.push("/noteEditor") }
    ];

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            setError(null);

            try {
                const userId = await AsyncStorage.getItem("userId");

                if (!userId) {
                    throw new Error("Usuário não autenticado");
                }

                const notes = await listNotes();

                if (notes.items.length === 0) setMessage('Ops! Não há notas criadas');
                if (!notes) throw new Error('Ops! Algo deu errado. Tente novamente :)')

                setNotes(notes.items);
                setFilteredNotes(notes.items);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                    Alert.alert("Erro: ", err.message)
                } else {
                    setError("Opa! Erro desconhecido ao carregar notas");
                }
                console.log("erro: ", err)
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);


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
                        <Text style={styles.headerText}>Folders</Text>
                        <Text style={styles.sharedText}>Shared</Text>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar"
                                placeholderTextColor="#9CA3AF"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>

                    {/* Notes List Grouped by Month */}
                    <ScrollView contentContainerStyle={styles.notesList}>
                        {loading && <Text style={styles.loading}>Loading...</Text>}
                        {error && <Text style={styles.error}>{error}</Text>}
                        {message && <Text style={styles.message}>{message}</Text>}

                        {(() => {
                            const validNotes = notes.filter(
                                (n): n is NoteWithCreatedAt => !!n.createdAt
                            );
                            const { groups, orderedKeys } = groupNotesByMonth(validNotes);

                            if (!loading && !error && orderedKeys.length === 0) {
                                return <Text style={styles.emptyText}>No notes yet.</Text>;
                            }

                            return orderedKeys.map((month) => (
                                <View key={month} style={{ marginBottom: 18 }}>
                                    <Text style={styles.monthTitle}>{month}</Text>

                                    <View>
                                        {groups[month].map((note: any) => (
                                            <View key={note.id} style={styles.noteCard} onTouchStart={() => router.push({
                                                pathname: "/noteEditor",
                                                params: { id: note.id }
                                            })}>
                                                <Text style={[styles.noteText, { fontWeight: "bold" }]} numberOfLines={1}>
                                                    {note.title ?? "Title of the notes"}
                                                </Text>

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


                    {/* Bottom Navigation (UI only) */}
                    <BottomNavigation />
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
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    noteText: {
        fontSize: 16,
        color: "#111827",
        margin: 10
    },
    noteFooter: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    dateText: {
        fontSize: 12,
        color: "#9CA3AF",
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
});
