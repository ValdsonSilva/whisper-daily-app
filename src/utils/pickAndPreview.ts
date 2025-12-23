import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import FileViewer from "react-native-file-viewer";

export type PickedAttachment = {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
};

export async function pickAndPreview(): Promise<PickedAttachment | null> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            multiple: false,
            copyToCacheDirectory: true,
        });

        if (result.canceled) return null;

        const asset = result.assets?.[0];
        if (!asset?.uri) return null;

        const picked: PickedAttachment = {
            uri: asset.uri,
            name: asset.name ?? "attachment",
            mimeType: asset.mimeType,
            size: asset.size,
        };

        // 1) Tenta FileViewer (funciona melhor em dev build / bare)
        try {
            await FileViewer.open(picked.uri, { showOpenWithDialog: true });
            return picked;
        } catch {
            // 2) Expo-friendly: usar Sharing para evitar FileUriExposedException no Android
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(picked.uri, {
                    mimeType: picked.mimeType,
                    dialogTitle: "Open attachment",
                    UTI: picked.mimeType, // iOS (não é perfeito, mas ok)
                });
            } else {
                console.log("Sharing not available on this device.");
            }
            return picked;
        }
    } catch (err) {
        console.log("pickAndPreview error:", err);
        return null;
    }
}
