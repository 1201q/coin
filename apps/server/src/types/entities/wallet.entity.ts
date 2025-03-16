import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Order } from "./order.entity";

@Entity({ name: "wallets" })
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  wallet_id: string;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  balance: number;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  available_balance: number;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  locked_balance: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Order, (order) => order.wallet)
  orders: Order[];
}
