import { DeviceManager } from './DeviceManager';

export class DvrProvisioner {
  /**
   * Provisiona um DVR automaticamente: conecta, descobre canais e cria as câmeras no sistema
   */
  static async provisionDvr(dvrConfig, addCameraCallback) {
    const driver = DeviceManager.getDriver(dvrConfig);
    
    // 1. Testa Conexão e Autenticação
    const connTest = await driver.testConnection();
    if (!connTest.success) {
      throw new Error(`Falha de conexão com o DVR em ${dvrConfig.tailscaleIp}`);
    }

    // 2. Descoberta de Canais e Metadados (Resolução, FPS, Codec)
    const discoveredChannels = await driver.getChannels();

    // 3. Criação Automática de Câmeras no Sistema
    const createdCameras = [];
    for (const ch of discoveredChannels) {
      const rtspUrl = driver.buildRtspUrl(ch.channel);
      const snapshotUrl = await driver.getSnapshot(ch.channel);
      
      const cameraObj = {
        id: `cam-${dvrConfig.id}-ch${ch.channel}`,
        dvrId: dvrConfig.id,
        name: ch.name || `${dvrConfig.name} - Canal ${ch.channel}`,
        channel: ch.channel,
        location: `${dvrConfig.name} (Canal ${ch.channel})`,
        resolution: ch.resolution || '1920x1080 (FHD)',
        fps: ch.fps || 30,
        codec: ch.codec || 'H.264',
        aiEnabled: true,
        monitoredClasses: ['Pessoa', 'Celular', 'Caixa Registradora'],
        rtspUrl: rtspUrl,
        snapshot: snapshotUrl,
        status: ch.isOnline ? 'ONLINE' : 'OFFLINE',
      };

      createdCameras.push(cameraObj);
      if (addCameraCallback) {
        addCameraCallback(cameraObj);
      }
    }

    return {
      success: true,
      dvrId: dvrConfig.id,
      totalDiscovered: discoveredChannels.length,
      cameras: createdCameras,
    };
  }
}
