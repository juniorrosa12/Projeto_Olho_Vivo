import { DeviceDriverFactory } from './DeviceDriverFactory';

class DeviceManagerSingleton {
  constructor() {
    this.driversCache = new Map();
    this.streamWatchdogInterval = null;
  }

  /**
   * Instancia ou recupera o Driver de um DVR registrado
   */
  getDriver(dvrConfig) {
    const key = dvrConfig.id || dvrConfig.tailscaleIp || 'default-dvr';
    if (!this.driversCache.has(key)) {
      const driver = DeviceDriverFactory.createDriver(dvrConfig);
      this.driversCache.set(key, driver);
    }
    return this.driversCache.get(key);
  }

  /**
   * Descoberta Automática de Canais via Driver / ONVIF
   */
  async discoverChannels(dvrConfig) {
    const driver = this.getDriver(dvrConfig);
    return await driver.getChannels();
  }

  /**
   * Obtém URL RTSP abstraída para o pipeline Vision / UI
   */
  getStreamUrl(dvrConfig, channel = 1) {
    const driver = this.getDriver(dvrConfig);
    return driver.buildRtspUrl(channel);
  }

  /**
   * Obtém URL de Snapshot estático do canal
   */
  async getSnapshotUrl(dvrConfig, channel = 1) {
    const driver = this.getDriver(dvrConfig);
    return await driver.getSnapshot(channel);
  }

  /**
   * Testa a conectividade real (Ping, Socket TCP HTTP e RTSP e validação de credenciais) via backend
   */
  async testDeviceConnection(dvrConfig) {
    const API = `${window.location.protocol}//${window.location.hostname}:8000`;
    try {
      const res = await fetch(`${API}/connector/test-dvr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: dvrConfig.tailscaleIp || dvrConfig.ip || '192.168.1.3',
          http_port: Number(dvrConfig.httpPort || 80),
          rtsp_port: Number(dvrConfig.rtspPort || 554),
          user: dvrConfig.user || 'admin',
          password: dvrConfig.password || '',
          manufacturer: dvrConfig.manufacturer || 'INTELBRAS',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.detail || 'Falha na validação do DVR.',
        };
      }
      return data;
    } catch (err) {
      // Fallback para o driver local caso a API esteja inacessível
      const driver = this.getDriver(dvrConfig);
      return await driver.testConnection();
    }
  }

  /**
   * Inicia o Watchdog de automonitoramento de reconexão
   */
  startWatchdog(onHealthCheck) {
    if (this.streamWatchdogInterval) return;
    this.streamWatchdogInterval = setInterval(() => {
      this.driversCache.forEach(async (driver, id) => {
        const health = await driver.health();
        onHealthCheck?.({ dvrId: id, ...health });
      });
    }, 5000);
  }

  stopWatchdog() {
    if (this.streamWatchdogInterval) {
      clearInterval(this.streamWatchdogInterval);
      this.streamWatchdogInterval = null;
    }
  }
}

export const DeviceManager = new DeviceManagerSingleton();
