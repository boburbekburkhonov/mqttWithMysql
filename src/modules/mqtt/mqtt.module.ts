import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { Station } from 'src/entities/station.entity';
import { mqtt_Data } from 'src/entities/mqtt_data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, mqtt_Data])],
  providers: [MqttService],
  controllers: [MqttController],
})
export class MqttModule {}
