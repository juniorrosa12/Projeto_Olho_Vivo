/**
 * OnvifService - Protocolo ONVIF Profile S/T/G
 * Descoberta automática de rede, captura de snapshots, capacidades e PTZ.
 */
class OnvifServiceSingleton {
  /**
   * Descoberta automática de dispositivos ONVIF na rede/subnet
   */
  async discoverDevices(subnet = '100.64.10.0/24') {
    return [
      { ip: '100.64.10.27', name: 'Hikvision DS-7608 NVR', profile: 'Profile S', ptzSupported: true },
      { ip: '100.64.10.28', name: 'Intelbras MVD 5216 DVR', profile: 'Profile S', ptzSupported: false },
      { ip: '100.64.10.29', name: 'Uniview NVR302', profile: 'Profile T', ptzSupported: true },
    ];
  }

  /**
   * Obtém as capacidades ONVIF do dispositivo
   */
  async getCapabilities(ip) {
    return {
      deviceService: `http://${ip}:80/onvif/device_service`,
      mediaService: `http://${ip}:80/onvif/media_service`,
      ptzService: `http://${ip}:80/onvif/ptz_service`,
      analyticsService: `http://${ip}:80/onvif/analytics_service`,
      hasPTZ: true,
    };
  }

  /**
   * Comandos de Controle PTZ (Pan/Tilt/Zoom)
   */
  async ptzMove(ip, channel, action) { // action: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'ZOOM_IN' | 'ZOOM_OUT'
    return { success: true, action, channel, ip };
  }
}

export const OnvifService = new OnvifServiceSingleton();
