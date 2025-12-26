import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    KeyboardAvoidingView,
    Alert,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AttachmentPopup from "../components/AttachmentPopup";
import { pickAttachment } from "../utils/pickAttachment";
import MoreOptionsPopup from "../components/MoreOptionsPopup";
import TextColorPickerPopup from "../components/TextColorPickerPopup";
import AttachmentsPreview from "../components/AttachmentPreview";
import { createNote } from "../api/notes-create";
import { getNoteById } from "../api/notes-details";
import { AttachmentView } from "../types/attachmentView";
import { updateNote } from "../api/notes-update";
import { UpdateNotePayload } from "../types/notesUpdate";
import { deleteNote } from "../api/notes-delete";
import { SafeAreaView } from "react-native-safe-area-context"


export default function NoteEditorScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const inputRef = useRef<TextInput>(null);
    const [attachOpen, setAttachOpen] = useState(false);
    const [attachAnchor, setAttachAnchor] = useState({ x: 20, y: 20 });
    const attachRef = useRef<View>(null);
    const [attachments, setAttachments] = useState<AttachmentView[]>([]);
    const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);

    const [moreOpen, setMoreOpen] = useState(false);
    const [moreAnchor, setMoreAnchor] = useState({ x: 0, y: 0 });

    const moreRef = useRef<View>(null);

    const [textColor, setTextColor] = useState("#000000");
    const [colorOpen, setColorOpen] = useState(false);
    const [colorAnchor, setColorAnchor] = useState({ x: 0, y: 0 });

    const colorRef = useRef<View>(null);

    console.log("Id da nota: ", id);

    function openMore() {
        moreRef.current?.measureInWindow((x, y, w, h) => {
            setMoreAnchor({ x: x + w, y }); // ancora no canto direito do botão
            setMoreOpen(true);
        });
    }

    function openAttachMenu() {
        attachRef.current?.measureInWindow((x, y, w, h) => {
            // ancora no centro do botão
            setAttachAnchor({ x: x + w / 2, y: y });
            setAttachOpen(true);
        });
    }

    async function handleAddFile() {
        try {
            const file = await pickAttachment();
            if (!file) return;

            const local: AttachmentView = {
                id: file.uri,
                previewUri: file.uri,
                name: file.name ?? "file",
                mimeType: file.mimeType,
                size: file.size,
                isRemote: false,
                kind: "local",
            };

            setAttachments((prev) => [local, ...prev]);
            console.log("Anexo adicionado:", file);
        } catch (err) {
            console.log("Erro ao anexar arquivo:", err);
        }
    }

    // Função para salvar a nota
    async function handleSaveNote() {

        if (id) {
            const cretatedTitle = text.trim().split("\n")[0] || title; // Pega a primeira linha ou "Untitled" se não houver conteúdo

            const payload: UpdateNotePayload = {
                title: cretatedTitle,
                content: text,

                addAttachments: attachments.filter((a) => a.isRemote === false),
                removeAttachmentIds: removedAttachmentIds, // você controla isso no state
            };
            try {
                const note = await updateNote(id as string, payload);  // Chama a função que salva a nota
                console.log("Nota nota atualizada:", note);
                router.back(); // Redireciona para a tela de notas
            } catch (err) {
                console.error("Erro ao salvar a nota:", err);
            }

        } else {
            if (text.trim() === "") {
                alert("Content is required!");
                return;
            }

            const title = text.trim().split("\n")[0] || "Untitled"; // Pega a primeira linha ou "Untitled" se não houver conteúdo

            const payload = {
                title: title,  // Você pode passar um título ou obter de um campo
                content: text, // Conteúdo completo da nota
                files: attachments.map((attachment) => attachment.previewUri),  // Envia os URIs dos arquivos anexados
            };

            try {
                const note = await createNote(payload);  // Chama a função que salva a nota
                console.log("Nota salva:", note);
                router.back(); // Redireciona para a tela de notas
            } catch (err) {
                console.error("Erro ao salvar a nota:", err);
            }
        }
    }

    useEffect(() => {
        if (!id) return;

        const fetchNoteDetails = async () => {
            try {
                const noteContent = await getNoteById(id as string);
                console.log("Detalhes da nota obtidos:", noteContent.noteAttachments);

                // Definindo o conteúdo da nota
                setTitle(noteContent.title || "");
                setText(noteContent.content);

                // Mapeia anexos da API -> AttachmentView
                const cloud = (noteContent.noteAttachments ?? []).map((a: any) => ({
                    id: a.id, // IMPORTANTÍSSIMO: id do attachment no banco
                    previewUri: a.secureUrl ?? a.url,
                    name: a.originalFilename ?? "attachment",
                    mimeType: a.resourceType ? `${a.resourceType}/${a.format}` : undefined,
                    size: a.bytes,
                    isRemote: true,
                })) as AttachmentView[];

                setAttachments(cloud);
                setRemovedAttachmentIds([]); // reseta remoções ao abrir
            } catch (err) {
                console.error("Erro ao buscar detalhes da nota:", err);
            }
        };

        fetchNoteDetails();
    }, [id]);

    function handleRemoveAttachment(id: string) {
        // captura o anexo antes de remover
        const att = attachments.find((a) => a.id === id);

        // remove visualmente (seu comportamento atual)
        setAttachments((prev) => prev.filter((a) => a.id !== id));

        // se for remoto, registra para o PATCH
        if (att?.isRemote) {
            setRemovedAttachmentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
    }

    async function handleDeleteNote() {

        if (id) {
            try {
                await deleteNote(id as string);
                router.push({
                    pathname: "/blocknotes",
                    params: { refresh: "true" }
                })
            } catch (err) {
                console.error("Erro ao deletar nota:", err);
            }
        } else {
            return;
        }
    }


    console.log("Anexos atuais:", attachments);

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.safe}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
            >

                {/* Top bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.topLeft}
                        activeOpacity={0.7}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.chevron}>‹</Text>
                        <Text style={styles.topLeftText}>Notes</Text>
                    </TouchableOpacity>

                    <View style={styles.topRight}>
                        <TouchableOpacity ref={moreRef as any} onPress={openMore} activeOpacity={0.7}>
                            <View style={styles.moreCircle}>
                                <Text style={styles.moreDots}>•••</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.okHit} onPress={handleSaveNote} activeOpacity={0.7}>
                            <Text style={styles.okText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <MoreOptionsPopup
                    visible={moreOpen}
                    onClose={() => setMoreOpen(false)}
                    anchor={moreAnchor}
                    onDelete={() => {
                        Alert.alert(
                            "Confirmação", // Título
                            "Deseja realmente cancelar este anexo?", // Mensagem
                            [
                                {
                                    text: "Cancelar",
                                    onPress: () => console.log("Usuário cancelou a ação"),
                                    style: "cancel" // No iOS, isso estiliza o botão para indicar uma ação segura
                                },
                                {
                                    text: "Sim, excluir",
                                    onPress: () => {
                                        console.log("Ação confirmada")
                                        setText('')
                                        setAttachments([])
                                        handleDeleteNote()
                                    },
                                    style: "destructive" // No iOS, deixa o texto em vermelho
                                }
                            ],
                            { cancelable: true } // No Android, permite fechar o alerta clicando fora dele
                        )
                        // aqui: chamar API delete / limpar estado
                    }}
                    onSaveDraft={() => {
                        console.log("Save as draft");
                        // aqui: persistir localmente ou API (draft=true)
                    }}
                />

                {/* Editor area */}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.editorWrapper} contentContainerStyle={styles.scrollViewContent}
                >
                    <TextInput
                        ref={inputRef}
                        style={[styles.editor, { color: textColor }]}
                        value={text}
                        onChangeText={setText}
                        placeholder=""
                        multiline
                        autoFocus={false}
                        textAlignVertical="top"
                    />

                    {/* Lista simples de anexos (para testar) */}
                    <AttachmentsPreview
                        attachments={attachments}
                        onRemove={handleRemoveAttachment}
                    />
                </ScrollView>

                {/* Bottom bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.bottomHit} activeOpacity={0.7}>
                        <View style={styles.sliderIcon}>
                            <Text style={styles.sliderTop}>◌</Text>
                            <Text style={styles.sliderBottom}>◌</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        ref={attachRef as any}
                        style={styles.bottomHit}
                        activeOpacity={0.7}
                        onPress={openAttachMenu}
                    >
                        <Text style={styles.bottomIcon}>📎</Text>
                    </TouchableOpacity>

                    <AttachmentPopup
                        visible={attachOpen}
                        onClose={() => setAttachOpen(false)}
                        anchor={attachAnchor}
                        onAddFile={() => {
                            console.log("Add a file");
                            handleAddFile() // adicionando anexos do dispositivo
                        }}
                        onTakePhotoOrVideo={() => {
                            console.log("Take picture / record video");
                            // Aqui depois você integra expo-image-picker / camera
                        }}
                    />

                    <TouchableOpacity
                        ref={colorRef as any}
                        style={styles.bottomHit}
                        activeOpacity={0.7}
                        onPress={() => {
                            colorRef.current?.measureInWindow((x, y, w) => {
                                setColorAnchor({ x: x + w / 2, y });
                                setColorOpen(true);
                            })
                        }}
                    >
                        <View style={[styles.aCircle, { backgroundColor: textColor }]}>
                            <Text style={styles.aText}>A</Text>
                        </View>
                    </TouchableOpacity>

                    <TextColorPickerPopup
                        visible={colorOpen}
                        anchor={colorAnchor}
                        onClose={() => setColorOpen(false)}
                        onSelectColor={(color) => setTextColor(color)}
                    />

                    <TouchableOpacity style={styles.bottomHit} activeOpacity={0.7}>
                        <Text style={styles.bottomIcon}>✎</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const IOS_BLUE = "#5B7CFF";

const styles = StyleSheet.create({
    attachBtn: { padding: 12 },
    attachmentRow: {
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.08)",
    },
    attachmentName: { fontSize: 14, fontWeight: "600", color: "#111827" },
    attachmentMeta: { marginTop: 2, fontSize: 12, color: "#6B7280" },

    safe: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        marginTop: 20,
    },

    topBar: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    topLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    chevron: {
        fontSize: 24,
        lineHeight: 24,
        color: IOS_BLUE,
        marginTop: -1,
    },
    topLeftText: {
        fontSize: 16,
        color: IOS_BLUE,
        fontWeight: "400",
    },

    topRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },

    iconHit: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    iconText: {
        fontSize: 18,
        color: IOS_BLUE,
    },

    moreCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: IOS_BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    moreDots: {
        fontSize: 12,
        letterSpacing: 2,
        color: IOS_BLUE,
        marginLeft: 2,
    },

    okHit: {
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2,
    },
    okText: {
        fontSize: 14,
        color: IOS_BLUE,
        fontWeight: "600",
    },

    editorWrapper: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 10,
        paddingBottom: 8,
    },
    editor: {
        flex: 1,
        position: "static",
        fontSize: 16,
        lineHeight: 22,
        color: "#111827",
        padding: 0,
    },
    scrollViewContent: {
        paddingBottom: 100, // Ajuste o padding se necessário para evitar sobreposição com o teclado
    },

    bottomBar: {
        height: 64,
        paddingHorizontal: 34,
        paddingBottom: 30,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
    },

    bottomHit: {
        width: 54,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },

    bottomIcon: {
        fontSize: 20,
        color: IOS_BLUE,
    },

    sliderIcon: {
        alignItems: "center",
        justifyContent: "center",
    },
    sliderTop: {
        fontSize: 12,
        color: IOS_BLUE,
        marginBottom: -2,
    },
    sliderBottom: {
        fontSize: 12,
        color: IOS_BLUE,
        marginTop: -2,
    },

    aCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: IOS_BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    aText: {
        fontSize: 14,
        color: IOS_BLUE,
        fontWeight: "600",
    },
});
