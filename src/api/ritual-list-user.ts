import api from "../service/api";

export type Subtask = {
    id: string;
    ritualId: String;
    content: String;
    done: Boolean;
    order: number

}

// Use string enums explicitamente
export enum RitualStatus {
    PLANNED = "PLANNED",
    COMPLETED = "COMPLETED",
    MISSED = "MISSED",
}

export type Ritual = {
    id: string;
    userId: string;
    title: string;
    note?: string | null;
    localDate: string; // ou Date, dependendo de como a API devolve
    status: RitualStatus;
    checkInAt: Date; // quando respondeu
    achieved: boolean; // null=sem resposta, true/false=sim/não
    aiReply: string; // 2–4 frases empáticas
    microStep: string; // sugestão curta para amanhã

    // Subtarefas
    subtasks: Subtask[]
};

export type ListRitualsResponse = {
    rituals: Ritual[];
};

export async function listRituals(userId: string): Promise<Ritual[]> {
    const { data } = await api.get<ListRitualsResponse>("/rituals", {
        params: { userId },
    });

    return data.rituals;
}
