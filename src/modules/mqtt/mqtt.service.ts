import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as mqtt from 'mqtt';
import { Station } from 'src/entities/station.entity';
import { IMqttConnectOptions } from 'src/types';
import { mqtt_Data } from 'src/entities/mqtt_data.entity';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(
    @InjectRepository(Station)
    private stationModel: Repository<Station>,
    @InjectRepository(mqtt_Data)
    private mqttDataModel: Repository<mqtt_Data>,
  ) {}

  private options: IMqttConnectOptions = {
    clean: true,
    connectTimeout: 4000,
    host: '185.196.214.190',
    port: 1883,
    username: 'emqx',
    password: '12345',
  };

  private topic: string = 'W/+/+/+/data';

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
        try {
          const data = JSON.parse(payload);
          const station = await this.stationModel.findOneBy({ code: data.i });

          if (station.code) {
            console.log(station, data);
            const level = Number(data.d) / 1000;
            const volume = Number(data.v) / 1000;
            const correc = Number(data.c);
            const dataYear = Number('20' + data.t.split('/')[0]);
            const dataMonth = data.t.split('/')[1];
            const dataDay = data.t.split('/')[2].slice(0, 2);
            const dataHour = Number(data.t.split(',')[1].slice(0, 2)) + 5;
            const dataMinute = data.t.split(':')[1];
            const time = new Date(
              dataYear,
              dataMonth - 1,
              dataDay,
              dataHour,
              dataMinute,
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

            await this.mqttDataModel
              .createQueryBuilder()
              .insert()
              .into(mqtt_Data)
              .values({
                st_id: station.id,
                level: level,
                volume: volume,
                time:
                  String(time.getFullYear()) +
                  timeMonth +
                  String(time.getDate()) +
                  timeHour +
                  timeMinute,
                corec: correc,
              })
              .execute();
          }
        } catch (error: unknown) {
          console.log(error);
        }
      },
    );
  }
}
