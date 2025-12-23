import * as DocumentPicker from "expo-document-picker";
import { NoteAttachment } from "../types/attachment";
import { AttachmentView } from "../types/attachmentView";

// tipo do backend (ajuste se seu retorno for diferente)
export type NoteAttachmentApi = {
    url: string;
    secureUrl: string;
    publicId: string;
    resourceType: string;
    format: string;
    bytes: number;
    width: number | null;
    height: number | null;
    duration: number | null;
    originalFilename: string;
};

export function mapLocalToView(a: NoteAttachment): AttachmentView {
    return {
        id: a.uri,
        kind: "local",
        previewUri: a.uri,
        name: a.name,
        mimeType: a.mimeType,
        size: a.size,
        isRemote: false
    };
}

export function mapApiToView(a: NoteAttachmentApi): AttachmentView {
    return {
        id: a.publicId,
        kind: "cloud",
        previewUri: a.secureUrl || a.url, // usa https
        name: a.originalFilename ?? a.publicId,
        mimeType: a.resourceType ? `${a.resourceType}/${a.format}` : undefined,
        size: a.bytes,
        publicId: a.publicId,
        isRemote: true
    };
}

export async function pickAttachment(): Promise<NoteAttachment | null> {
    const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const a = result.assets?.[0];
    if (!a?.uri) return null;

    return {
        uri: a.uri,
        name: a.name ?? "attachment",
        mimeType: a.mimeType,
        size: a.size,
    };
}
