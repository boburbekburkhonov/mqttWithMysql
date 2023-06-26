import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttDataService } from './mqtt.data.service';
import { MqttController } from './mqtt.controller';
import { Station } from 'src/entities/station.entity';
import { mqtt_Data } from 'src/entities/mqtt_data.entity';
import { MqttInfoService } from './mqtt.info.service';

@Module({
  imports: [TypeOrmModule.forFeature([Station, mqtt_Data])],
  providers: [MqttDataService, MqttInfoService],
  controllers: [MqttController],
})
export class MqttModule {}
