import { HikvisionDriver } from './drivers/HikvisionDriver';
import { DahuaDriver } from './drivers/DahuaDriver';
import { IntelbrasDriver } from './drivers/IntelbrasDriver';
import { UniviewDriver } from './drivers/UniviewDriver';
import { GenericRtspDriver } from './drivers/GenericRtspDriver';

export class DeviceDriverFactory {
  static createDriver(dvrConfig) {
    const manufacturer = dvrConfig?.manufacturer?.toUpperCase();

    switch (manufacturer) {
      case 'HIKVISION':
        return new HikvisionDriver(dvrConfig);
      case 'DAHUA':
        return new DahuaDriver(dvrConfig);
      case 'INTELBRAS':
        return new IntelbrasDriver(dvrConfig);
      case 'UNIVIEW':
        return new UniviewDriver(dvrConfig);
      default:
        return new GenericRtspDriver(dvrConfig);
    }
  }
}
