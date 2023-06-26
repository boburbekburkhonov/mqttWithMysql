import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mqtt-data')
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
    type: 'float',
  })
  level: number;

  @Column({
    name: 'volume',
    type: 'float',
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
