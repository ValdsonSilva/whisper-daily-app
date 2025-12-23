// src/services/auth.ts
import api from "../service/api";

export type LanguageCode =
    | "pt_BR"
    | "en_US"
    | "es_ES";

export type AnonymousRegisterPayload = {
    locale: LanguageCode;
    timeZone: string;
};

export type AnonymousRegisterResponse = {
    userId: string;
    token: string;
};

export async function registerAnonymous(
    payload: AnonymousRegisterPayload
): Promise<AnonymousRegisterResponse> {
    const { data } = await api.post<AnonymousRegisterResponse>(
        "/auth/anonymous",
        payload
    );
    return data;
}
