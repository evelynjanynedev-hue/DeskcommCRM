/**
 * Política de reconexão do Hermes.
 *
 * Backoff exponencial + jitter evita tempestade de reconexões quando a rede
 * volta e várias organizações tentam abrir o socket ao mesmo tempo.
 */
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 60_000;

export function reconnectDelayMs(attempt: number, random = Math.random): number {
  const safeAttempt = Math.max(0, Math.min(attempt, 10));
  const exponential = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** safeAttempt);
  const jitter = Math.floor(exponential * 0.2 * random());
  return Math.min(MAX_DELAY_MS, exponential + jitter);
}

export function shouldReconnect(disconnectReason: "temporary" | "logged_out" | "revoked"): boolean {
  return disconnectReason === "temporary";
}
