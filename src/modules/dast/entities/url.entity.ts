import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScanTraceEntity } from './scan-trace.entity';
import { UrlScanTypes } from '../enums/url-scan.enum';

@Entity('url')
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'url' })
  url: string;

  @Column({ type: 'varchar', name: 'method', nullable: true })
  method?: string;

  @Column({ type: 'boolean', name: 'processed', nullable: true })
  processed?: boolean;

  @Column({ type: 'boolean', name: 'in_scope' })
  inScope: boolean;

  @Column({ type: 'enum', enum: UrlScanTypes, name: 'type' })
  type: UrlScanTypes;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ScanTraceEntity, (scan) => scan.urls)
  scan: ScanTraceEntity;
}
