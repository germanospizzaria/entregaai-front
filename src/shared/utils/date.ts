/**
 * Utilitários para manipulação de datas
 */

/**
 * Retorna a data atual no formato ISO (YYYY-MM-DD)
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Retorna o início do dia atual no formato ISO
 */
export const getTodayStart = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split("T")[0];
};

/**
 * Retorna o fim do dia atual no formato ISO
 */
export const getTodayEnd = (): string => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toISOString().split("T")[0];
};

/**
 * Verifica se os filtros correspondem ao dia atual
 */
export const isCurrentDayFilter = (
  startDate?: string,
  endDate?: string
): boolean => {
  const today = getCurrentDateISO();
  return startDate === today && endDate === today;
};

/**
 * Formata data para exibição em português
 */
export const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Verifica se uma data está dentro do intervalo
 */
export const isDateInRange = (
  date: Date,
  startDate?: string,
  endDate?: string
): boolean => {
  if (!startDate || !endDate) return true;

  const dateStr = date.toISOString().split("T")[0];
  return dateStr >= startDate && dateStr <= endDate;
};
