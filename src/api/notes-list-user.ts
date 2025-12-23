import api from "../service/api";
import type { Note } from "./notes-create";

export type ListNotesResponse = {
    items: Note[];
    nextCursor: string | null;
};

export type ListNotesParams = {
    archived?: boolean;
    take?: number;
    cursor?: string | null;
    order?: "asc" | "desc";
};

export async function listNotes(params: ListNotesParams = {}): Promise<ListNotesResponse> {
    const { archived, take, cursor, order } = params;

    const { data } = await api.get<ListNotesResponse>("/notes", {
        params: {
            archived: archived === undefined ? undefined : String(archived), // "true"/"false"
            take,
            cursor: cursor ?? undefined,
            order,
        },
    });

    return data;
}
