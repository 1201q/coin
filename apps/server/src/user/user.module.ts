import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../types/entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Wallet } from "src/types/entities/wallet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
