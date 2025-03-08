import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "trades" })
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: "decimal", precision: 18, scale: 8 })
  amount: number;

  @Column({ type: "decimal", precision: 18, scale: 8 })
  price: number;

  @Column({ type: "varchar" })
  type: "buy" | "sell";

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
