import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "test_users" })
export class TestUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}

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

  @Column({ type: "clob", nullable: true })
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
