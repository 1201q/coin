import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trade } from "./trade.entity";
import { Wallet } from "./wallet.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  order_id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.orders)
  @JoinColumn({ name: "wallet_id" })
  wallet: Wallet;

  @Column({ type: "varchar", length: 10 })
  symbol: string;

  @Column({ type: "varchar", length: 4 })
  side: "BUY" | "SELL";

  @Column({ type: "varchar", length: 10 })
  type: "LIMIT" | "MARKET"; // 지정가, 시장가

  @Column({ type: "decimal", precision: 18, scale: 8, nullable: true })
  price: number | null; // 주문 가격, 시장가 주문시 null

  @Column({ type: "decimal", precision: 18, scale: 8, nullable: true })
  quantity: number | null; // 주문 수량, 시장가 주문시 null

  @Column({ type: "decimal", precision: 18, scale: 8 })
  total: number; // 시장가는 사용자 입력, 지정가는 price * quantity

  @Column({ type: "decimal", precision: 18, scale: 8, default: 0 })
  filled_quantity: number; // 체결완료된 주문 수량

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "varchar", length: 10, default: "PENDING" })
  status: "PENDING" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";
  // 체결 대기 | 부분 체결 | 모두 체결 완료 | 주문 취소

  @OneToMany(() => Trade, (trade) => trade.order)
  trades: Trade[];
}
