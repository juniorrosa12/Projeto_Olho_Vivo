/**
 * EventEngine - Barramento de Eventos Desacoplado (Pub/Sub)
 * Orquestra eventos de IA, hardware, fila e status de filiais.
 */
class EventEngineSingleton {
  constructor() {
    this.subscribers = new Map(); // eventName -> Set(callback)
    this.history = [];
  }

  /**
   * Inscreve um callback para ouvir um tipo de evento específico
   */
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);

    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  /**
   * Publica um evento desacoplado no barramento do sistema
   */
  publish(eventType, payload) {
    const eventObj = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: eventType,
      timestamp: new Date().toISOString(),
      payload,
    };

    this.history.unshift(eventObj);
    if (this.history.length > 200) this.history.pop();

    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach((cb) => cb(eventObj));
    }
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach((cb) => cb(eventObj));
    }

    return eventObj;
  }

  getHistory() {
    return this.history;
  }
}

export const EventEngine = new EventEngineSingleton();
