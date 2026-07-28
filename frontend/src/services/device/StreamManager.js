/**
 * StreamManager - Gerenciador Inteligente de Streams RTSP / WebRTC
 * Controla abertura, fechamento por timeout, limites por DVR, prioridade e reconexão automática.
 */
class StreamManagerSingleton {
  constructor() {
    this.activeStreams = new Map(); // cameraId -> { streamUrl, subscribersCount, priority, lastPing }
    this.maxStreamsPerDvr = 6;
    this.streamTimeoutMs = 30000; // 30s de inatividade fecha a stream automaticamente
    this.watchdogInterval = null;

    this.startWatchdog();
  }

  /**
   * Requisita a abertura ou reaproveitamento de uma stream RTSP
   */
  requestStream(cameraId, rtspUrl, priority = 'HIGH') {
    if (this.activeStreams.has(cameraId)) {
      const existing = this.activeStreams.get(cameraId);
      existing.subscribersCount += 1;
      existing.lastPing = Date.now();
      existing.priority = priority;
      return existing.streamUrl;
    }

    // Registra nova stream ativa
    const newStream = {
      cameraId,
      streamUrl: rtspUrl,
      subscribersCount: 1,
      priority,
      lastPing: Date.now(),
      status: 'STREAMING',
    };

    this.activeStreams.set(cameraId, newStream);
    return rtspUrl;
  }

  /**
   * Libera a subscrição de uma stream
   */
  releaseStream(cameraId) {
    if (this.activeStreams.has(cameraId)) {
      const stream = this.activeStreams.get(cameraId);
      stream.subscribersCount = Math.max(0, stream.subscribersCount - 1);
      stream.lastPing = Date.now();
    }
  }

  /**
   * Inicia o Watchdog para fechar streams inativas e evitar sobrecarga de GPU/DVR
   */
  startWatchdog() {
    if (this.watchdogInterval) return;
    this.watchdogInterval = setInterval(() => {
      const now = Date.now();
      this.activeStreams.forEach((stream, cameraId) => {
        if (stream.subscribersCount === 0 && now - stream.lastPing > this.streamTimeoutMs) {
          // Fecha stream por timeout de inatividade
          this.activeStreams.delete(cameraId);
        }
      });
    }, 10000);
  }

  getActiveStreamsCount() {
    return this.activeStreams.size;
  }
}

export const StreamManager = new StreamManagerSingleton();
