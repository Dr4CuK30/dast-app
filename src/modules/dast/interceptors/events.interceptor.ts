import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { ScanStatusEnum } from '../enums/scan-status.enum';

@Injectable()
export class EventsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(EventsInterceptor.name);
  constructor(
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const kafkaArgs = context.getArgs()[1]?.args;
    if (kafkaArgs && kafkaArgs[0].topic) {
      this.logger.log(
        `[ EXECUTING ${kafkaArgs[0].topic} WITH SCAN_ID: ${context.getArgs()[0].scanTraceId} ]`,
      );
      return next.handle().pipe(
        catchError(async (error) => {
          this.logger.error(
            `[ FAILED ${kafkaArgs[0].topic} WITH SCAN_ID: ${context.getArgs()[0].scanTraceId} ]`,
          );
          this.logger.error(error);
          await this.scanTraceEntity.save({
            id: context.getArgs()[0].scanTraceId,
            status: ScanStatusEnum.FAILED,
          });
        }),
      );
    } else return next.handle();
  }
}
