import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UpbitModule } from "./upbit/upbit.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [UpbitModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
