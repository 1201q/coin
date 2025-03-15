import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "wallets" })
export class Wallet {
  @PrimaryColumn({ unique: true })
  wallet_id: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: "wallet_id" })
  user: User;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  balance: number;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  available_balance: number;

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  locked_balance: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
