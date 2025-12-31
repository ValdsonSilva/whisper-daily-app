import api from "../../service/api";
import { RitualStatus } from "./ritual-list-user";

// Ajuste esse tipo conforme o seu modelo Prisma `RitualDay`
export type Ritual = {
    id: string;
    userId: string;
    title: string;
    note?: string | null;
    localDate: string; // ou Date | string, conforme sua API
    // acrescente aqui outros campos do modelo (status, subtasks, etc.)
};

export type RitualUpdatePayload = {
    title?: string;
    note?: string | null;
    localDate?: string; // string ISO
    subtasks?: any[];
    status?: RitualStatus;
};

/**
 * Chama PUT /rituals/:id para atualizar um ritual
 */
export async function updateRitual(
    id: string,
    data: RitualUpdatePayload
): Promise<Ritual> {
    const response = await api.put<{ ritual: Ritual }>(`/rituals/${id}`, data);
    return response.data.ritual;
}
