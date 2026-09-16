/**
 * Estado operacional de uma sessão Baileys mantida pelo Hermes.
 *
 * Este módulo não abre socket e não conhece UI/CRM. Ele define o contrato
 * mínimo usado pelo gerenciador de conexões persistentes.
 */
export type HermesConnectionStatus =
  | "STARTING"
  | "SCAN_QR_CODE"
  | "WORKING"
  | "STOPPED"
  | "FAILED";

export interface HermesConnectionState {
  sessionId: string;
  status: HermesConnectionStatus;
  qr: string | null;
  connectedAt: Date | null;
  lastDisconnectAt: Date | null;
  reconnectAttempts: number;
  lastError: string | null;
}

export function initialHermesConnectionState(sessionId: string): HermesConnectionState {
  return {
    sessionId,
    status: "STARTING",
    qr: null,
    connectedAt: null,
    lastDisconnectAt: null,
    reconnectAttempts: 0,
    lastError: null,
  };
}
