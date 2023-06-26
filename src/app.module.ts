import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { mqtt_Data } from './entities/mqtt_data.entity';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { stationInfo } from './entities/station.info.entity';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin_wialon',
      password: 'admin_wialon',
      database: 'admin_wialon',
      entities: [Station, mqtt_Data, stationInfo],
      synchronize: true,
    }),
    MqttModule,
  ],
})
export class AppModule {}
