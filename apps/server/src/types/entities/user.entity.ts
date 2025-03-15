import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Wallet } from "./wallet.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "varchar", length: 50 })
  type: "google";

  @Column({ unique: true })
  user_id: string;

  @Column({ unique: true })
  wallet_id: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  @JoinColumn({ name: "wallet_id" })
  wallet: Wallet;

  @Column({ type: "varchar", length: 500, nullable: true })
  refresh_token: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}

export interface GoogleUser {
  provider: string;
  userId: string;
  email: string;
  name: string;
  accessToken: string;
}
