import { Module } from '@nestjs/common';
import { DastController } from './controllers/dast.controller';
import { SpiderService } from './services/spider.service';
import { ScannerModule } from 'src/resources/scanner/scanner.module';
import { ScannersEnum } from 'src/resources/scanner/enums/scanners.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanTraceEntity } from './entities/scan-trace.entity';
import { UrlEntity } from './entities/url.entity';
import { AscanService } from './services/ascan.service';
import { DastService } from './services/dast.service';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';
import { DastEventsController } from 'src/modules/dast/controllers/dast-events.controller';
import { AlertEntity } from './entities/alert.entity';
import { TagsEntity } from './entities/tags.entity';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { AjaxSpiderService } from './services/ajax-spider.service';
import { EventsInterceptor } from './interceptors/events.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AlertsService } from './services/alerts.service';
import { AlertsController } from './controllers/alerts.controller';

@Module({
  imports: [
    KafkaModule,
    CacheModule,
    ScannerModule.register({
      type: ScannersEnum[process.env.SCANNER_TYPE] || ScannersEnum.ZAPROXY,
    }),
    TypeOrmModule.forFeature([
      ScanTraceEntity,
      UrlEntity,
      AlertEntity,
      TagsEntity,
    ]),
  ],
  controllers: [DastController, DastEventsController, AlertsController],
  providers: [
    SpiderService,
    AjaxSpiderService,
    AscanService,
    DastService,
    AlertsService,
    { provide: APP_INTERCEPTOR, useClass: EventsInterceptor },
  ],
  exports: [DastService],
})
export class DastModule {}
