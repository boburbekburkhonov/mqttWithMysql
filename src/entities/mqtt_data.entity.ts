import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class mqtt_Data {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'mqtt_data_id',
  })
  id: number;

  @Column({
    name: 'st_id',
  })
  st_id: number;

  @Column({
    name: 'level',
  })
  level: number;

  @Column({
    name: 'volume',
  })
  volume: number;

  @Column({
    name: 'time',
  })
  time: string;

  @Column({
    name: 'corec',
  })
  corec: number;
}
