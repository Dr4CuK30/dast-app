import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AlertEntity } from './alert.entity';

@Entity('tags')
export class TagsEntity {
  @Column({ type: 'varchar', name: 'name', primary: true })
  name: string;

  @Column({ type: 'varchar', name: 'source' })
  source: string;

  @ManyToMany(() => AlertEntity, (alert) => alert.tags)
  @JoinTable()
  alerts: AlertEntity[];
}
