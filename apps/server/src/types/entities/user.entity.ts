import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Wallet } from "./wallet.entity";
import { v4 as uuidv4 } from "uuid";

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

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn({ name: "wallet_id" })
  wallet: Wallet;

  @Column({ type: "varchar", length: 500, nullable: true })
  refresh_token: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @BeforeInsert()
  generateWalletId() {
    if (!this.wallet_id) {
      this.wallet_id = uuidv4();
    }
  }
}

export interface GoogleUser {
  provider: string;
  userId: string;
  email: string;
  name: string;
  accessToken: string;
}
