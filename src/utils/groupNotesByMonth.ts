function toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value);
}

function monthKey(date: Date) {
    // Ex.: "October 2025"
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function groupNotesByMonth<T extends { createdAt: string | Date }>(notes: T[]) {
    const groups: Record<string, T[]> = {};

    for (const note of notes) {
        const d = toDate(note.createdAt);
        const key = monthKey(d);

        if (!groups[key]) groups[key] = [];
        groups[key].push(note);
    }

    // Ordena notas dentro de cada mês (mais recente primeiro)
    for (const key of Object.keys(groups)) {
        groups[key].sort(
            (a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
        );
    }

    // Ordena os meses (mais recente primeiro), baseado no 1º dia do mês
    const orderedKeys = Object.keys(groups).sort((a, b) => {
        const ad = toDate(groups[a][0].createdAt);
        const bd = toDate(groups[b][0].createdAt);
        return bd.getTime() - ad.getTime();
    });

    return { groups, orderedKeys };
}
