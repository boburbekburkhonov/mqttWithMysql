import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as mqtt from 'mqtt';
import { Station } from 'src/entities/station.entity';
import { IMqttConnectOptions } from 'src/types';
import { mqtt_Data } from 'src/entities/mqtt_data.entity';
import { stationInfo } from 'src/entities/station.info.entity';

@Injectable()
export class MqttInfoService implements OnModuleInit {
  constructor(
    @InjectRepository(Station)
    private stationModel: Repository<Station>,
    @InjectRepository(mqtt_Data)
    private stationInfoModel: Repository<stationInfo>,
    private dataSource: DataSource,
  ) {}

  private options: IMqttConnectOptions = {
    clean: true,
    connectTimeout: 4000,
    host: '185.196.214.190',
    port: 1883,
    username: 'emqx',
    password: '12345',
  };

  private topic: string = 'W/+/+/+/info';

  private mqttClient: any;

  // !MQTT CONNECT
  onModuleInit() {
    this.mqttClient = mqtt.connect(this.options);

    this.mqttClient.on('connect', (): void => {
      this.mqttClient.subscribe(this.topic);
      console.log('Connected');
    });

    this.mqttClient.on('error', (error: unknown): void => {
      console.log(error);
    });

    this.mqttClient.on(
      'message',
      async (topic: string, payload: string): Promise<void> => {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const info = JSON.parse(payload);
          const station = await queryRunner.manager.query(
            `select * from station where code = ${info.i}`,
          );

          if (station[0].code) {
            console.log(info, station);
            const infoYear = Number('20' + info.t.split('/')[0]);
            const infoMonth = info.t.split('/')[1];
            const infoDay = info.t.split('/')[2].slice(0, 2);
            const infoHour = Number(info.t.split(',')[1].slice(0, 2)) + 5;
            const infoMinute = info.t.split(':')[1];
            const time = new Date(
              infoYear,
              infoMonth - 1,
              infoDay,
              infoHour,
              infoMinute,
            );
            const timeMonth =
              String(Number(time.getMonth() + 1)).length == 1
                ? '0' + String(Number(time.getMonth() + 1))
                : String(Number(time.getMonth() + 1));
            const timeHour =
              String(time.getHours()).length == 1
                ? '0' + String(time.getHours())
                : String(time.getHours());
            const timeMinute =
              String(time.getMinutes()).length == 1
                ? '0' + String(time.getMinutes())
                : String(time.getMinutes());

            const antenna = info.p9.includes(',')
              ? info.p9.split(',')[0]
              : info.p9;

            await queryRunner.manager.save(stationInfo, {
              st_id: station[0].station_id,
              battery: Number(info.p8),
              antenna: antenna,
              time:
                String(time.getFullYear()) +
                timeMonth +
                String(time.getDate()) +
                timeHour +
                timeMinute,
            });
          }
        } catch (error: unknown) {
          console.log(error);
        } finally {
          await queryRunner.release();
        }
      },
    );
  }
}
