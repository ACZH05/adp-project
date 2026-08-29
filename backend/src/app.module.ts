import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { VerificationModule } from './verification/verification.module';
import { SupabaseModule } from './supabase/supabase.module';
import { DocumentModule } from './document/document.module';
import { ApplicationModule } from './application/application.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    VerificationModule,
    SupabaseModule,
    DocumentModule,
    ApplicationModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
