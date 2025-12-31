import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  anchor: { x: number; y: number }; // coordenadas do botão "..."
  onDelete: () => void;
  onSaveDraft: () => void;
};

export default function MoreOptionsPopup({
  visible,
  onClose,
  anchor,
  onDelete,
  onSaveDraft,
}: Props) {
  const { t } = useTranslation("optionsPopup")
  const width = 280;

  // posiciona abaixo do "..." com leve deslocamento à esquerdas
  const left = Math.max(12, anchor.x - width + 12);
  const top = Math.max(12, anchor.y + 40);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.card, { left, top, width }]} onPress={() => { }}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.75}
            onPress={() => {
              onClose();
              onDelete();
            }}
          >
            <Text style={styles.rowText}>{t("deleteNote")}</Text>
            <Text style={styles.trash}>🗑️</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* <TouchableOpacity
            style={styles.row}
            activeOpacity={0.75}
            onPress={() => {
              onClose();
              onSaveDraft();
            }}
          >
            <Text style={styles.rowText}>Save as draft</Text>
            <View style={{ width: 22 }} />
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
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "400",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.28)",
    marginHorizontal: 18,
  },
  trash: {
    fontSize: 18,
    // emoji já vem colorido; se trocar por ícone, você pinta de vermelho
  },
});
