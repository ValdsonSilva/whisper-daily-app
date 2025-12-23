/**
 * Converte uma string de data para o formato "dd/mm/yyyy".
 * @param dateString Ex: "2025-12-18" ou "2025-12-18T14:30:00Z"
 */
export const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);

    // Verifica se a string fornecida resultou em uma data válida
    if (isNaN(date.getTime())) {
        return "Data inválida";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};