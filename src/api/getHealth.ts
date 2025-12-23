import api from "../service/api";

export type HealthResponse = {
    ok: boolean;
    ts: string;
    message: string;
};

export async function getHealth(): Promise<HealthResponse> {
    const { data } = await api.get<HealthResponse>("/health");
    return data;
}
