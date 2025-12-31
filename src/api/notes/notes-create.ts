import api from "../../service/api";

// Tipo da resposta da rota
export type Note = {
    id?: string,
    title: string | null;
    content: string;
    userId?: string,
    createdAt?: Date,
    updatedAt?: Date
    archivedAt?: Date
    noteAttachments: Array<{
        url: string;
        secureUrl: string;
        publicId: string;
        resourceType: string;
        format: string;
        bytes: number;
        width: number | null;
        height: number | null;
        duration: number | null;
        originalFilename: string;
    }>;
};

export type CreateNotePayload = {
    title?: string;
    content: string;
    files: Array<string | null>; // URI dos arquivos
};

export async function createNote(payload: CreateNotePayload): Promise<Note> {
    const formData = new FormData();

    // Adiciona os campos de texto
    if (payload.title) {
        formData.append("title", payload.title);
    }
    formData.append("content", payload.content);

    // Adiciona os arquivos
    payload.files.forEach((file, index) => {
        if (file) {
            formData.append("files" as any, {
                uri: file,
                name: `file_${index}.jpg`, // Aqui você pode mudar a extensão conforme o tipo do arquivo
                type: "image/jpeg", // ou outro tipo dependendo do arquivo
            } as any);
        }
    });

    try {
        const { data } = await api.post<Note>("/notes", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Define que é um formulário com múltiplos tipos de conteúdo
            },
        });

        console.log("Nota criada com sucesso:", data);
        return data;
    } catch (error) {
        console.error("Erro ao criar a nota:", error);
        throw error;
    }
}
