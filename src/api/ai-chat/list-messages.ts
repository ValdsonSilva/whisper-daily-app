import api from "../../service/api";

export type AiThreadMessage = {
    id: string;
    role: "USER" | "ASSISTANT" | "SYSTEM"; // ajuste se seu backend usa outros nomes
    content: string;
    createdAt?: string;
};

export type ListThreadMessagesResponse = {
    items: AiThreadMessage[];
    nextCursor: string | null;
};

export type ListThreadMessagesParams = {
    threadId: string;
    take?: number;
    cursor?: string | null;
};

export async function listThreadMessages(
    params: ListThreadMessagesParams
): Promise<ListThreadMessagesResponse> {
    const { threadId, take, cursor } = params;

    const { data } = await api.get<ListThreadMessagesResponse>(
        `/ai/threads/${threadId}/messages`,
        {
            params: {
                take,
                cursor: cursor ?? null,
            },
        }
    );

    return data;
}
