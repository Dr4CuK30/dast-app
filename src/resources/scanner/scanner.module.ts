import { DynamicModule, Module } from '@nestjs/common';
import { ScannersEnum } from './enums/scanners.enum';

@Module({})
export class ScannerModule {
  static async register(options: {
    type: ScannersEnum;
  }): Promise<DynamicModule> {
    const { ScannerImplementation } = await import(
      `./services/${options.type}.service`
    );
    return {
      module: ScannerModule,
      providers: [{ provide: 'SCANNER', useClass: ScannerImplementation }],
      exports: ['SCANNER'],
    };
  }
}
