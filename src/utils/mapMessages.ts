import { AiThreadMessage } from "../api/ai-chat/list-messages";

type ChatMessage = {
    id: string;
    text: string;
    from: "USER" | "ASSISTANT" | "SYSTEM";
};

export default function mapThreadMessageToChat(m: AiThreadMessage): ChatMessage {
    return {
        id: m.id,
        text: m.content,
        from: m.role === 'ASSISTANT' ? 'ASSISTANT' : m.role === 'SYSTEM' ? 'SYSTEM' : 'USER',
    };
}
