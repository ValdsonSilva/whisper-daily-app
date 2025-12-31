import api from "../../service/api";
import { Note } from "./notes-create";

// Tipo da resposta da rota
export type GetNoteResponse = Note;

// Função para pegar uma nota por ID
export async function getNoteById(id: string): Promise<Note> {
    try {
        const { data } = await api.get<GetNoteResponse>(`/notes/${id}`);
        return data;  // Retorna a nota
    } catch (err) {
        console.error("Erro ao buscar a nota:", err);
        throw err;  // Lança o erro para ser tratado em outro lugar, se necessário
    }
}
