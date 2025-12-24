import api from "../service/api";

/**
 * Hard delete da nota (remove nota + anexos no Cloudinary)
 */
export async function deleteNote(noteId: string): Promise<void> {
    if (!noteId) {
        throw new Error("noteId é obrigatório para deletar a nota");
    }

    await api.delete(`/notes/${noteId}`);
}