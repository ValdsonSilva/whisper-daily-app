import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    anchor: { x: number; y: number }; // posição do botão (page coords)
    onAddFile: () => void;
    onTakePhotoOrVideo: () => void;
};

export default function AttachmentPopup({
    visible,
    onClose,
    anchor,
    onAddFile,
    onTakePhotoOrVideo,
}: Props) {
    // Ajuste fino para ficar acima do ícone
    const popupWidth = 220;
    const left = Math.max(12, anchor.x - popupWidth / 2);
    const top = Math.max(12, anchor.y - 140);
    const { t } = useTranslation("attachmentPopup");

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={[styles.card, { left, top, width: popupWidth }]} onPress={() => { }}>
                    <TouchableOpacity
                        style={[styles.item, styles.itemDivider]}
                        activeOpacity={0.75}
                        onPress={() => {
                            onClose();
                            onAddFile();
                        }}
                    >
                        <Text style={styles.label}>{t("labelFile")}</Text>
                        <Text style={styles.icon}>📄</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={styles.item}
                        activeOpacity={0.75}
                        onPress={() => {
                            onClose();
                            onTakePhotoOrVideo();
                        }}
                    >
                        <Text style={styles.label}>Take a picture or record a video</Text>
                        <Text style={styles.icon}>📷</Text>
                    </TouchableOpacity> */}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "transparent",
    },
    card: {
        position: "absolute",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    itemDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.12)",
    },
    label: {
        flex: 1,
        fontSize: 13,
        color: "#111827",
    },
    icon: {
        fontSize: 16,
        opacity: 0.85,
    },
});
