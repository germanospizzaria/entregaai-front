/**
 * Utility functions for JWT token handling
 */

/**
 * Verifica se um token JWT está expirado
 * @param token - O token JWT para verificar
 * @returns true se o token estiver expirado, false caso contrário
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (error) {
    // Se não conseguir decodificar o token, considera como expirado
    console.warn("Failed to decode token:", error);
    return true;
  }
};

/**
 * Obtém o tempo de expiração de um token JWT
 * @param token - O token JWT
 * @returns Date object representando quando o token expira, ou null se inválido
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.warn("Failed to get token expiration:", error);
    return null;
  }
};
