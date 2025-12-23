import api from "../service/api";
import { UpdateNotePayload } from "../types/notesUpdate";
import type { Note } from "./notes-create"; // ou notes-types

export async function updateNote(
    noteId: string,
    payload: UpdateNotePayload
): Promise<Note> {
    const formData = new FormData();

    // campos simples
    if (payload.title !== undefined) {
        formData.append("title", payload.title);
    }

    if (payload.content !== undefined) {
        formData.append("content", payload.content);
    }

    // ids de anexos a remover
    if (payload.removeAttachmentIds?.length) {
        formData.append(
            "removeAttachmentIds",
            JSON.stringify(payload.removeAttachmentIds)
        );
    }

    // novos anexos (apenas os locais!)s
    if (payload.addAttachments?.length) {
        payload.addAttachments.forEach((file) => {
            // só anexos locais têm uri "file://"
            if (!file.isRemote) {
                formData.append("files", {
                    uri: file.previewUri,
                    name: file.name,
                    type: file.mimeType ?? "application/octet-stream",
                } as any);
            }
        });
    }

    const response = await api.patch<Note>(
        `/notes/${noteId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}
