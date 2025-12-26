import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"
import { sendAiChatMessage } from "../api/ai-chat/create-message";
import { listThreadMessages } from "../api/ai-chat/list-messages";
import mapThreadMessageToChat from "../utils/mapMessages";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ChatMessage = {
    id: string;
    text: string;
    from: "USER" | "ASSISTANT" | "SYSTEM";
};

export default function WhisperChatScreen() {
    const [message, setMessage] = useState("");
    const [threadId, setThreadId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            text: "I'm excited to know how it was\nfor you, tell me!",
            from: "ASSISTANT",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [loadingThread, setLoadingThread] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const cachedThreadId = async () => {
        const cached = await AsyncStorage.getItem("whisperThreadId");

        if (cached) setThreadId(cached);
    }

    useEffect(() => {
        console.log("Entrou")

        cachedThreadId();

        if (!threadId) return;

        const load = async () => {
            try {
                setLoadingThread(true);

                const res = await listThreadMessages({
                    threadId,
                    take: 30,
                    cursor: null, // primeira página
                });

                const mapped = res.items.map(mapThreadMessageToChat);

                console.log("Mensagens: ", mapped);

                // Se sua API retorna do mais novo -> mais antigo, inverta:
                // mapped.reverse();

                setChatMessages(mapped);
                setCursor(res.nextCursor);
                setHasMore(!!res.nextCursor);
            } catch (err) {
                console.error("Erro ao carregar mensagens da thread:", err);
            } finally {
                setLoadingThread(false);
            }
        };

        load();
    }, [threadId]);

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: trimmed,
            from: "USER",
        };

        setChatMessages((prev) => [...prev, userMsg]);
        setMessage("");

        try {
            setIsTyping(true);

            const result = await sendAiChatMessage({
                content: trimmed,
                threadId,
            });

            setThreadId(result.threadId);
            await AsyncStorage.setItem("whisperThreadId", result.threadId);

            const whisperMsg: ChatMessage = {
                id: `${Date.now()}-whisper`,
                text: result.reply,
                from: "ASSISTANT",
            };

            setChatMessages((prev) => [...prev, whisperMsg]);
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);

            // fallback visual (opcional)
            const errorMsg: ChatMessage = {
                id: `${Date.now()}-error`,
                text: "Sorry, something went wrong. Please try again.",
                from: "SYSTEM",
            };

            setChatMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                    <Text style={styles.iconButtonText}>{"<"}</Text>
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>LOGO</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Whisper</Text>
                        <Text style={styles.headerSubtitle}>Available to help you.</Text>
                    </View>
                </View>
            </View>

            {/* Mensagens */}
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={true}
                scrollsToTop={true}
            >
                {chatMessages.map((msg) => (
                    <View
                        key={msg.id}
                        style={
                            msg.from === "ASSISTANT"
                                ? styles.messageBubble
                                : styles.messageBubbleRight
                        }
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}

                {isTyping && (
                    <View style={styles.typingBubble}>
                        <Text style={styles.typingText}>Whisper is typing...</Text>
                    </View>
                )}
            </ScrollView>

            {/* Input de mensagem */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "position"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <View style={styles.inputBarWrapper}>
                    <View style={styles.inputBar}>
                        <TouchableOpacity style={styles.inputLeftIcon}>
                            <Text style={styles.iconSmall}>🧷</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Message..."
                            placeholderTextColor="#9CA3AF"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />

                        <TouchableOpacity style={styles.inputRightIcon}>
                            <Text style={styles.iconSmall}>🎤</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.sendButton}
                        activeOpacity={0.85}
                        onPress={handleSend}
                    >
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: pallete.secondary_white,
    },

    /* HEADER */
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ECEBFF",
        backgroundColor: pallete.secondary_white,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    iconButtonText: {
        fontSize: 18,
        color: "#111827",
    },
    headerCenter: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        justifyContent: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#94A3B8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    avatarText: {
        fontSize: 10,
        color: pallete.white,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#6B7280",
    },

    /* MENSAGENS */
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    messageBubble: {
        alignSelf: "flex-start",
        backgroundColor: pallete.white,
        paddingTop: 20,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        maxWidth: "80%",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8,
    },
    messageBubbleRight: {
        alignSelf: "flex-end",
        backgroundColor: pallete.main_bg,
        marginTop: 20,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 6,
        maxWidth: "80%",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8,
    },
    messageText: {
        fontSize: 14,
        color: "#111827",
        lineHeight: 20,
        marginBottom: 4,
    },

    typingBubble: {
        marginTop: 16,
        alignSelf: "flex-start",
        backgroundColor: "#E3EDFF",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    typingText: {
        fontSize: 12,
        color: "#4B5563",
    },

    /* INPUT BAR */
    inputBarWrapper: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 8,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: pallete.secondary_white,
    },
    inputBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: pallete.white,
        borderRadius: 24,
        paddingHorizontal: 10,
        paddingVertical: 6,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputLeftIcon: {
        paddingHorizontal: 4,
    },
    inputRightIcon: {
        paddingHorizontal: 4,
    },
    iconSmall: {
        fontSize: 18,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
        paddingHorizontal: 8,
        paddingVertical: 4,
        maxHeight: 90,
    },

    sendButton: {
        marginLeft: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },
    sendIcon: {
        fontSize: 18,
        color: pallete.white,
    },
});
