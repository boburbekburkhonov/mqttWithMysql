import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('station_info')
export class stationInfo {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'station_info_id',
  })
  id: number;

  @Column({
    name: 'st_id',
  })
  st_id: number;

  @Column({
    name: 'time',
  })
  time: string;

  @Column({
    name: 'battery',
  })
  battery: number;

  @Column({
    name: 'antenna',
  })
  antenna: number;
}
