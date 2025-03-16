import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.entity";
import { Wallet } from "./wallet.entity";

@Entity({ name: "trades" })
export class Trade {
  @PrimaryGeneratedColumn("uuid")
  trade_id: string;

  @ManyToOne(() => Order, (order) => order.trades)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @Column({ type: "varchar" })
  symbol: string;

  @Column({ type: "varchar", length: 4 })
  side: "BUY" | "SELL";

  @Column({ type: "decimal", precision: 18, scale: 8 })
  price: number | null; // 주문 가격

  @Column({ type: "decimal", precision: 18, scale: 8 })
  quantity: number | null; // 주문 수량

  @Column({ type: "decimal", precision: 18, scale: 8 })
  total: number; // 총 거래금액

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
