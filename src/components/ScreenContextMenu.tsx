import React, { ReactNode, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    GestureResponderEvent,
} from "react-native";

export type ScreenContextMenuItem = {
    label: string;
    icon?: string; // pode ser emoji, ou trocar depois por ícone (lucide, etc.)
    onPress: () => void;
};

type Props = {
    children: ReactNode;
    items: ScreenContextMenuItem[];
    longPressDelayMs?: number;
    menuWidth?: number;
};

export default function ScreenContextMenu({
    children,
    items,
    longPressDelayMs = 250,
    menuWidth = 260,
}: Props) {
    const [visible, setVisible] = useState(false);
    const [anchor, setAnchor] = useState<{ x: number; y: number }>({ x: 16, y: 80 });

    const safeItems = useMemo(() => items.filter(Boolean), [items]);

    function openMenu(e: GestureResponderEvent) {
        const { pageX, pageY } = e.nativeEvent;

        // posiciona próximo ao dedo; ajusta o X para "centralizar" o card
        const x = Math.max(12, pageX - menuWidth / 2);
        const y = Math.max(12, pageY - 20);

        setAnchor({ x, y });
        setVisible(true);
    }

    function closeMenu() {
        setVisible(false);
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Wrapper da tela inteira: long press abre menu */}
            <Pressable style={{ flex: 1 }} onLongPress={openMenu} delayLongPress={longPressDelayMs}>
                {children}
            </Pressable>

            {/* Menu */}
            <Modal visible={visible} transparent animationType="fade" onRequestClose={closeMenu}>
                <Pressable style={styles.backdrop} onPress={closeMenu}>
                    {/* evita clique no backdrop quando toca no menu */}
                    <Pressable
                        style={[styles.menuCard, { left: anchor.x, top: anchor.y, width: menuWidth }]}
                        onPress={() => { }}
                    >
                        {safeItems.map((item, idx) => (
                            <TouchableOpacity
                                key={`${item.label}-${idx}`}
                                style={[styles.menuItem, idx === safeItems.length - 1 && styles.menuItemLast]}
                                activeOpacity={0.75}
                                onPress={() => {
                                    closeMenu();
                                    item.onPress();
                                }}
                            >
                                <Text style={styles.menuIcon}>{item.icon ?? "•"}</Text>
                                <Text style={styles.menuLabel} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.12)",
    },
    menuCard: {
        position: "absolute",
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.96)",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.08)",
    },
    menuItemLast: { borderBottomWidth: 0 },
    menuIcon: { width: 26, fontSize: 16 },
    menuLabel: { fontSize: 14, color: "#111827", fontWeight: "500", flex: 1 },
});
