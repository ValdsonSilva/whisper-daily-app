import api from "../../service/api";

// Se já tiver esse tipo definido aqui, reaproveita:
export type Ritual = {
    id: string;
    userId: string;
    title: string;
    note?: string | null;
    localDate: string; // ou Date | string
    checkInAt?: Date; // quando respondeu
    achieved?: boolean;
    aiReply?: string | null;
    // adicione os demais campos do seu modelo RitualDay se quiser
};

export type RegisterCheckInPayload = {
    achieved: boolean;
    aiReply?: string;
    microStep?: string;
    checkInAt?: Date; // quando respondeu
};

export type RegisterCheckInResponse = {
    ritual: Ritual;
};

import axios from "axios";

export async function registerRitualCheckIn(
    userId: string,
    payload: RegisterCheckInPayload
): Promise<Ritual> {
    console.log("id do usuário: ", userId);

    try {
        const response = await api.post<RegisterCheckInResponse>(
            `/rituals/${userId}/checkin`,
            payload
        );

        console.log("Response: ", response.data.ritual);
        return response.data.ritual;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log("Erro: ", error.message);
            throw new Error("Ritual não encontrado");
        }

        console.log("Erro ao fazer check-in:", error.message);
        throw error;
    }
}

