import api from "../../service/api";
import { Ritual, RitualStatus } from "./ritual-list-user";

export type ListRitualsByStatusResponse = {
    items: Ritual[];
    nextCursor: string | null;
};

export type ListRitualsByStatusParams = {
    userId: string;
    status: RitualStatus | RitualStatus[]; // 1 ou vários status
    dateFrom?: string; // "2025-12-05"
    dateTo?: string;
    take?: number;
    cursor?: string | null;
    order?: "asc" | "desc";
};

function serializeStatus(status: RitualStatus | RitualStatus[]): string {
    return Array.isArray(status) ? status.join(",") : status as any;
}

export async function listRitualsByStatus(
    params: ListRitualsByStatusParams
): Promise<ListRitualsByStatusResponse> {
    const { userId, status, dateFrom, dateTo, take, cursor, order } = params;

    console.log("Params: ", { params });

    const { data } = await api.get<ListRitualsByStatusResponse>(
        "/rituals/status",
        {
            params: {
                userId,
                status, // ex.: "PLANNED,COMPLETED"
                dateFrom,
                dateTo,
                take,
                cursor,
                order,
            },
        }
    );

    return data; // data.items e data.nextCursor
}
