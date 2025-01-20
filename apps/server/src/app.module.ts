import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UpbitModule } from './upbit/upbit.module';

@Module({
  imports: [UpbitModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
