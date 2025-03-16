import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../types/entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Wallet } from "src/types/entities/wallet.entity";
import { Trade } from "src/types/entities/trade.entity";
import { Order } from "src/types/entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Trade, Order])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
