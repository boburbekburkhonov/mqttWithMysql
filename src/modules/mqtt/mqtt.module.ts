import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { Station } from 'src/entities/station.entity';
import { Mqtt_Data } from 'src/entities/mqtt_data.entity copy';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Mqtt_Data])],
  providers: [MqttService],
  controllers: [MqttController],
})
export class MqttModule {}
