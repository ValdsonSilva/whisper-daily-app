import api from "../../service/api";

export type AiChatResponse = {
    reply: string;
    threadId: string;
};

export type AiChatPayload = {
    // role: 
    content: string;
    threadId?: string | null;
};

/**
 * Envia uma mensagem do usuário para a IA e recebe a resposta.
 * Mantém o contexto via threadId (opcional).
 */
export async function sendAiChatMessage(
    payload: AiChatPayload
): Promise<AiChatResponse> {
    const { content, threadId } = payload;

    if (!content || !content.trim()) {
        throw new Error('Campo "content" é obrigatório.');
    }

    const response = await api.post<AiChatResponse>("/ai/chat", {
        content,
        threadId: threadId ?? null,
    });

    return response.data;
}
