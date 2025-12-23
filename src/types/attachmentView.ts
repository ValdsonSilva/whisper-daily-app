export type AttachmentView = {
    id?: string;            // uri (local) ou publicId (cloud)
    kind: "local" | "cloud";
    previewUri: string;    // sempre uma string renderizável no <Image />
    name: string;
    mimeType?: string;
    size?: number;
    publicId?: string;     // cloud

    isRemote?: boolean;          // 🔑 opcional (backward compatible)
};
