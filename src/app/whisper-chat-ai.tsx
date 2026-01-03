import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from "react-native";
import { pallete } from "../theme/palette";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"
import { sendAiChatMessage } from "../api/ai-chat/create-message";
import { listThreadMessages } from "../api/ai-chat/list-messages";
import mapThreadMessageToChat from "../utils/mapMessages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

type ChatMessage = {
    id: string;
    text: string;
    from: "USER" | "ASSISTANT" | "SYSTEM";
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitAssistantReply(
    threadId: string,
    listThreadMessages: (args: { threadId: string; take: number; cursor: string | null }) => Promise<any>,
    mapThreadMessageToChat: (m: any) => ChatMessage
): Promise<ChatMessage | null> {
    for (let i = 0; i < 20; i++) {
        const res = await listThreadMessages({ threadId, take: 30, cursor: null });
        const mapped: ChatMessage[] = res.items.map(mapThreadMessageToChat);

        const lastAssistant = [...mapped]
            .reverse()
            .find((m) => m?.from === "ASSISTANT" && typeof m.text === "string" && m.text.trim().length > 0);

        if (lastAssistant) return lastAssistant;

        await sleep(600);
    }

    return null;
}

export default function WhisperChatScreen() {
    const { t } = useTranslation("chat");
    const [message, setMessage] = useState("");
    const [threadId, setThreadId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            text: t("firstChatMessage"),
            from: "ASSISTANT",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    // const [cursor, setCursor] = useState<string | null>(null);
    // const [hasMore, setHasMore] = useState(true);
    const loadedThreadIdRef = useRef<string | null>(null);
    const threadIdFromCacheRef = useRef(false);
    const flatListRef = useRef<any>(null);


    useEffect(() => {
        (async () => {
            const cached = await AsyncStorage.getItem("whisperThreadId");
            if (cached) {
                threadIdFromCacheRef.current = true;
                setThreadId(cached);
            }
        })();
    }, []);

    useEffect(() => {
        if (!threadId) return;

        // Só carrega histórico se veio do cache (ex.: reabrir app/tela)
        if (!threadIdFromCacheRef.current) return;

        if (loadedThreadIdRef.current === threadId) return;
        loadedThreadIdRef.current = threadId;

        (async () => {
            const res = await listThreadMessages({ threadId, take: 30, cursor: null });
            if (res.items.length > 0) {
                const mapped = res.items.map(mapThreadMessageToChat);
                setChatMessages(mapped);
            }

            return;
        })();
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

            console.log("Mensagens antes:", chatMessages.length)

            const result = await sendAiChatMessage({
                content: trimmed,
                ...(threadId ? { threadId } : {}),
            });

            setThreadId(result.threadId);
            threadIdFromCacheRef.current = false;
            AsyncStorage.setItem("whisperThreadId", result.threadId).catch(console.log);

            // 1) tenta usar reply diretamente se vier
            let replyText =
                typeof result.reply === "string" ? result.reply : "";

            // 2) se não veio, busca no histórico até aparecer
            if (!replyText.trim()) {
                const last = await waitAssistantReply(result.threadId, listThreadMessages, mapThreadMessageToChat);
                replyText = last?.text ?? "";
            }

            if (!replyText.trim()) {
                // fallback: evita balão vazio
                replyText = "Não consegui obter a resposta agora. Tente novamente.";
            }

            const whisperMsg: ChatMessage = {
                id: `${Date.now()}-${Math.random().toString(36)}`,
                text: replyText,
                from: "ASSISTANT",
            };

            setChatMessages((prev) => [...prev, whisperMsg]);


        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);

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
                        <Text style={styles.headerSubtitle}>{t("headerSubTitle")}</Text>
                    </View>
                </View>
            </View>

            {/* mensagens */}
            <FlatList
                ref={flatListRef}
                data={chatMessages.filter(Boolean)}
                keyExtractor={(item: any) => item.id}
                style={styles.messagesContainer}
                contentContainerStyle={[styles.messagesContent, { paddingBottom: 20 }]}
                // Propriedade crucial para 2026: garante re-renderização se isTyping mudar
                extraData={isTyping}

                // Renderização dos balões de mensagem
                renderItem={({ item: msg }: any) => (
                    <View
                        style={
                            msg.from === "ASSISTANT"
                                ? styles.messageBubble
                                : styles.messageBubbleRight
                        }
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                )}

                // Componente de "Digitando" fica aqui para não quebrar a lista
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingBubble}>
                            <Text style={styles.typingText}>{t("typingText")}</Text>
                        </View>
                    ) : null
                }

                // Garante que a lista role para o fim quando o conteúdo aumentar
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                // Garante que role para o fim ao carregar inicialmente
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input de mensagem */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
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
        paddingBottom: 8,
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
