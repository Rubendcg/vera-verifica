import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getTypeOrmModuleOptions } from './database/typeorm.config';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { CapacityModule } from './modules/capacity/capacity.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PartiesModule } from './modules/parties/parties.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { VerificationsModule } from './modules/verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmModuleOptions,
    }),
    AuthModule,
    UsersModule,
    PartiesModule,
    VehiclesModule,
    VerificationsModule,
    DocumentsModule,
    ReportsModule,
    NotificationsModule,
    AnalyticsModule,
    CapacityModule,
    ServiceOrdersModule,
    BillingModule,
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
