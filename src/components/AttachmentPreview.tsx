import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Sharing from "expo-sharing";
import { AttachmentView } from "../types/attachmentView";
import * as FileSystem from "expo-file-system/legacy";

function sanitize(name: string) {
    return name.replace(/[^\w.\-()+ ]/g, "_");
}

function isImage(mime?: string) {
    return !!mime && mime.startsWith("image/");
}
function isVideo(mime?: string) {
    return !!mime && mime.startsWith("video/");
}
function isPdf(mime?: string) {
    return mime === "application/pdf";
}

type Props = {
    attachments: AttachmentView[];
    onRemove?: (uri: string) => void;
};

export default function AttachmentsPreview({ attachments, onRemove }: Props) {
    if (!attachments.length) return null;

    async function openAttachment(uri: string, mimeType?: string, name?: string) {
        try {
            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) return;

            let localUri = uri;

            if (uri.startsWith("http://") || uri.startsWith("https://")) {
                const fileName = sanitize(name ?? uri.split("/").pop() ?? "attachment");
                const target = `${FileSystem.cacheDirectory}${fileName}`;

                const downloaded = await FileSystem.downloadAsync(uri, target);
                localUri = downloaded.uri; // file://
            }

            await Sharing.shareAsync(localUri, { mimeType, dialogTitle: "Open attachment" });
        } catch (e: any) {
            console.log("Erro ao compartilhar:", e?.message ?? e);
        }
    }

    return (
        <View style={styles.container}>
            {attachments.map((a) => {
                // IMAGEM: renderiza inline
                if (isImage(a.mimeType)) {
                    return (
                        <View key={a.id} style={styles.block}>
                            <TouchableOpacity activeOpacity={0.85} onPress={() => openAttachment(a.previewUri, a.mimeType)}>
                                <Image source={{ uri: a.previewUri }} style={styles.image} resizeMode="cover" />
                            </TouchableOpacity>

                            <View style={styles.metaRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.name} numberOfLines={1}>{a.name}</Text>
                                    <Text style={styles.meta} numberOfLines={1}>
                                        {a.mimeType ?? "image"}{a.size ? ` • ${Math.round(a.size / 1024)} KB` : ""}
                                    </Text>
                                </View>

                                {!!onRemove && (
                                    <TouchableOpacity onPress={() => onRemove(a.id!)} style={styles.removeBtn} activeOpacity={0.8}>
                                        <Text style={styles.removeText}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }

                // VÍDEO/PDF/OUTROS: card (pode evoluir para thumbnail de vídeo depois)
                return (
                    <TouchableOpacity
                        key={a.id}
                        activeOpacity={0.85}
                        onPress={() => openAttachment(a.previewUri, a.mimeType)}
                        style={styles.fileCard}
                    >
                        <View style={styles.fileLeft}>
                            <Text style={styles.fileIcon}>
                                {isPdf(a.mimeType) ? "📄" : isVideo(a.mimeType) ? "🎬" : "📎"}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.name} numberOfLines={1}>{a.name}</Text>
                            <Text style={styles.meta} numberOfLines={1}>
                                {a.mimeType ?? "file"}{a.size ? ` • ${Math.round(a.size / 1024)} KB` : ""}
                            </Text>
                        </View>

                        {!!onRemove && (
                            <TouchableOpacity onPress={() => onRemove(a.previewUri)} style={styles.removeBtn} activeOpacity={0.8}>
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 22,
        paddingBottom: 14,
        gap: 14,
    },

    block: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(0,0,0,0.10)",
    },

    image: {
        width: "100%",
        height: 210,
        backgroundColor: "#E5E7EB",
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 12,
    },

    fileCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(0,0,0,0.10)",
    },

    fileLeft: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
    },

    fileIcon: { fontSize: 18 },

    name: { fontSize: 13, fontWeight: "600", color: "#111827" },
    meta: { marginTop: 2, fontSize: 11, color: "#6B7280" },

    removeBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(0,0,0,0.12)",
    },
    removeText: { fontSize: 12, color: "#111827", fontWeight: "500" },
});
