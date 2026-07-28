/**
 * DeviceDriverInterface
 * 
 * Standard Driver Interface for all DVR/NVR/Camera Manufacturers.
 * Implemented by HikvisionDriver, DahuaDriver, IntelbrasDriver, UniviewDriver, and GenericRtspDriver.
 */
export class DeviceDriverInterface {
  constructor(dvrConfig) {
    this.config = dvrConfig;
  }

  async connect() {
    throw new Error('DeviceDriver.connect() must be implemented by manufacturer driver');
  }

  async disconnect() {
    throw new Error('DeviceDriver.disconnect() must be implemented by manufacturer driver');
  }

  async getChannels() {
    throw new Error('DeviceDriver.getChannels() must be implemented by manufacturer driver');
  }

  async getSnapshot(channel = 1) {
    throw new Error('DeviceDriver.getSnapshot() must be implemented by manufacturer driver');
  }

  buildRtspUrl(channel = 1) {
    throw new Error('DeviceDriver.buildRtspUrl() must be implemented by manufacturer driver');
  }

  async health() {
    throw new Error('DeviceDriver.health() must be implemented by manufacturer driver');
  }

  async testConnection() {
    throw new Error('DeviceDriver.testConnection() must be implemented by manufacturer driver');
  }
}
