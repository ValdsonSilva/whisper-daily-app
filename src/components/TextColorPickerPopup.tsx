import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    anchor: { x: number; y: number };
    onClose: () => void;
    onSelectColor: (color: string) => void;
};

const COLORS = [
    "#000000", // black
    "#1E6FFF", // blue
    "#34C759", // green
    "#FFD60A", // yellow
    "#FF3B30", // red
];

export default function TextColorPickerPopup({
    visible,
    anchor,
    onClose,
    onSelectColor,
}: Props) {
    const size = 36;
    const gap = 12;
    const width = COLORS.length * size + (COLORS.length - 1) * gap + 24;

    const left = Math.max(12, anchor.x - width / 2);
    const top = Math.max(12, anchor.y - 80);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable
                    style={[styles.container, { left, top, width }]}
                    onPress={() => { }}
                >
                    {COLORS.map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: color },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => {
                                onSelectColor(color);
                                onClose();
                            }}
                        />
                    ))}
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
    container: {
        position: "absolute",
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 14,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
});
