import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Station {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'station_id',
  })
  id: number;

  @Column({
    name: 'code',
  })
  code: string;
}
