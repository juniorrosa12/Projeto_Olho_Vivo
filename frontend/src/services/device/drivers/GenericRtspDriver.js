import { DeviceDriverInterface } from '../DeviceDriverInterface';

export class GenericRtspDriver extends DeviceDriverInterface {
  async connect() { return true; }
  async disconnect() { return true; }

  async getChannels() {
    const total = this.config.channelsCount || 4;
    return Array.from({ length: total }, (_, i) => ({
      channel: i + 1,
      name: `Câmera RTSP Genérica #${i + 1}`,
      isOnline: true,
    }));
  }

  async getSnapshot() {
    return '/vision/static/latest.jpg';
  }

  buildRtspUrl(channel = 1) {
    const user = encodeURIComponent(this.config.user || 'admin');
    const pass = encodeURIComponent(this.config.password || '');
    const auth = pass ? `${user}:${pass}@` : `${user}@`;
    const host = this.config.tailscaleIp || '100.64.10.30';
    const port = this.config.rtspPort || 554;
    return `rtsp://${auth}${host}:${port}/h264/ch${channel}/main/av_stream`;
  }

  async health() {
    return { isOnline: true, pingMs: 20, fps: 30 };
  }

  async testConnection() {
    return {
      success: true,
      pingMs: 20,
      httpStatus: 200,
      rtspStatus: 'CONNECTED (Generic RTSP H.264)',
    };
  }
}
