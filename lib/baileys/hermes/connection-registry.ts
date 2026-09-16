import {
  initialHermesConnectionState,
  type HermesConnectionState,
} from "./connection-state";

/**
 * Registro em memória dos sockets que pertencem a ESTE processo Hermes.
 *
 * Credenciais nunca moram aqui: o registro pode desaparecer num restart sem
 * exigir novo QR. A persistência das credenciais será implementada pelo
 * AuthStore durável.
 */
export class HermesConnectionRegistry<TSocket> {
  private readonly sockets = new Map<string, TSocket>();
  private readonly states = new Map<string, HermesConnectionState>();

  getSocket(sessionId: string): TSocket | null {
    return this.sockets.get(sessionId) ?? null;
  }

  setSocket(sessionId: string, socket: TSocket): void {
    this.sockets.set(sessionId, socket);
    if (!this.states.has(sessionId)) {
      this.states.set(sessionId, initialHermesConnectionState(sessionId));
    }
  }

  deleteSocket(sessionId: string): void {
    this.sockets.delete(sessionId);
  }

  getState(sessionId: string): HermesConnectionState {
    const current = this.states.get(sessionId);
    if (current) return current;

    const created = initialHermesConnectionState(sessionId);
    this.states.set(sessionId, created);
    return created;
  }

  patchState(sessionId: string, patch: Partial<Omit<HermesConnectionState, "sessionId">>): HermesConnectionState {
    const next = { ...this.getState(sessionId), ...patch, sessionId };
    this.states.set(sessionId, next);
    return next;
  }

  hasSocket(sessionId: string): boolean {
    return this.sockets.has(sessionId);
  }
}
