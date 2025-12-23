import type { AttachmentView } from "../types/attachmentView";

export type UpdateNotePayload = {
    title?: string;
    content?: string;

    /** novos arquivos locais para upload */
    addAttachments?: AttachmentView[];

    /** ids dos anexos já existentes que devem ser removidos */
    removeAttachmentIds?: string[];
};
