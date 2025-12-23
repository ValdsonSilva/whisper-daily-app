import api from "../service/api";

export type Subtask = {
    id?: string;
    title: string;
    done?: boolean;
};

export type UpsertMorningPayload = {
    userId: string;
    localDate: string; // envia como string ISO
    title: string;
    note?: string;
    subtasks?: Subtask[];
};

export type UpsertMorningResponse = {
    ritual: any;   // se você tiver o tipo Ritual do backend, pode tipar melhor
    aiReply: string;
};

export async function upsertMorningRitual(
    payload: UpsertMorningPayload
): Promise<UpsertMorningResponse> {
    const { data } = await api.post<UpsertMorningResponse>(
        "/rituals/upsert",
        payload
    );
    return data;
}
