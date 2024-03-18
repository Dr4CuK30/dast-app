import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { UrlEntity } from './url.entity';
import { AlertEntity } from './alert.entity';

@Entity('scan_trace')
export class ScanTraceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'spider_id', nullable: true })
  spiderId?: number;

  @Column({ type: 'int', name: 'ascan_id', nullable: true })
  ascanId?: number;

  @Column({ type: 'varchar', name: 'main_url' })
  mainUrl: string;

  @Column({ type: 'enum', name: 'status', enum: ScanStatusEnum })
  status: ScanStatusEnum;

  @Column({ type: 'boolean', name: 'include_ajax_scan', default: false })
  includeAjaxScan: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UrlEntity, (url) => url.scan)
  urls: UrlEntity[];

  @OneToMany(() => AlertEntity, (url) => url.scan)
  alerts: AlertEntity[];
}
