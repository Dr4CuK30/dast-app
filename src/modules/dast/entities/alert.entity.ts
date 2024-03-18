import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScanTraceEntity } from './scan-trace.entity';
import { AlertRiskEnum } from '../enums/alert-risk.enum';
import { TagsEntity } from './tags.entity';

@Entity('alert')
export class AlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'url' })
  url: string;

  @Column({ type: 'varchar', name: 'method' })
  method?: string;

  @Column({ type: 'int', name: 'source_id' })
  sourceId: number;

  @Column({ type: 'int', name: 'plugin_id' })
  pluginId: number;

  @Column({ type: 'int', name: 'cwe_id' })
  cweId: number;

  @Column({ type: 'int', name: 'wasc_id' })
  wascId: number;

  @Column({ type: 'text', name: 'other' })
  other: string;

  @Column({ type: 'varchar', name: 'evidence' })
  evidence: string;

  @Column({ type: 'enum', name: 'confidence', enum: AlertRiskEnum })
  confidence: AlertRiskEnum;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'int', name: 'message_id' })
  messageId: number;

  @Column({ type: 'varchar', name: 'input_vector' })
  inputVector: string;

  @Column({ type: 'text', name: 'reference' })
  reference: string;

  @Column({ type: 'text', name: 'solution' })
  solution: string;

  @Column({ type: 'varchar', name: 'alert' })
  alert: string;

  @Column({ type: 'varchar', name: 'param' })
  param: string;

  @Column({ type: 'varchar', name: 'attack' })
  attack: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'enum', enum: AlertRiskEnum, name: 'risk' })
  risk: AlertRiskEnum;

  @Column({ type: 'varchar', name: 'alert_ref' })
  alertRef: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ScanTraceEntity, (scan) => scan.alerts)
  scan: ScanTraceEntity;

  @ManyToMany(() => TagsEntity, (tag) => tag.alerts)
  tags: TagsEntity[];
}
