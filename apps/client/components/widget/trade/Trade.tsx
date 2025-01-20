"use client";

import { useEffect, useState } from "react";
import styles from "./Trade.module.css";
import dayjs from "dayjs";
import { WebsocketTradeData } from "@/types/fetch";

interface TradeRenderData {
  timestamp: number;
  ask_bid: string;
  trade_price: number;
  trade_volume: number;
  change_price: number;
  sequential_id: number;
  color?: "red" | "blue";
}

const convertWebsocketDataType = (
  data: WebsocketTradeData
): TradeRenderData => {
  return {
    timestamp: data.trade_timestamp,
    ask_bid: data.ask_bid,
    trade_price: data.trade_price,
    trade_volume: data.trade_volume,
    change_price: data.change_price,
    sequential_id: data.sequential_id,
  };
};

export default function Trade({
  initialData,
}: {
  initialData: TradeRenderData[];
}) {
  const [tradeData, setTradeData] = useState<TradeRenderData[]>(initialData);

  useEffect(() => {
    const ws = new WebSocket("wss://ws-api.bithumb.com/websocket/v1");

    ws.onopen = () => {
      const request = JSON.stringify([
        { ticket: "test example" },
        { type: "trade", codes: ["KRW-BTC"] },
      ]);
      ws.send(request);
    };

    ws.onmessage = async (event) => {
      try {
        const jsonData: WebsocketTradeData = await new Response(
          event.data
        ).json();

        if (jsonData.type === "trade") {
          const newTrade = convertWebsocketDataType(jsonData);
          const updateTrade = { ...newTrade };

          setTradeData((prev) => {
            const latestData = prev[0]; // 항상 최신 데이터 참조

            if (latestData) {
              if (newTrade.trade_price > latestData.trade_price) {
                updateTrade.color = "red"; // 상승
              } else if (newTrade.trade_price < latestData.trade_price) {
                updateTrade.color = "blue"; // 하락
              } else {
                updateTrade.color = latestData.color; // 동일 -> 이전 색상 유지
              }
            } else {
              updateTrade.color = newTrade.ask_bid === "ASK" ? "red" : "blue"; // 초기값 처리
            }

            return [updateTrade, ...prev.slice(0, 29)];
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => ws.close();
  }, []);

  return (
    <table className={styles.table}>
      {/* 시세 헤더 */}
      <thead className={styles.headerContainer}>
        <tr>
          <th>
            <div className={styles.header}>체결시간</div>
          </th>
          <th>
            <div className={`${styles.header} ${styles.right}`}>체결가격</div>
          </th>
          <th>
            <div className={`${styles.header} ${styles.right}`}>체결량</div>
          </th>
          <th>
            <div className={`${styles.header} ${styles.right}`}>체결액</div>
          </th>
        </tr>
      </thead>
      {/* 시세 데이터 */}
      <tbody className={styles.itemContainer}>
        <tr>
          <td className={styles.gap} colSpan={4}></td>
        </tr>
        {tradeData.map((item, index) => (
          <tr key={`${index}-${item.sequential_id}`}>
            <td>
              <div className={styles.item}>
                {dayjs(item.timestamp).format("HH:mm:ss")}
              </div>
            </td>
            <td>
              <div className={`${styles.item} ${styles.right}`}>
                {item.trade_price.toLocaleString()}
              </div>
            </td>
            <td>
              <div
                className={`${styles.item} ${styles.right} ${
                  item.color === "red" ? styles.red : styles.blue
                }`}
              >
                {item.trade_volume.toFixed(5)}
                {item.ask_bid}
              </div>
            </td>
            <td>
              <div className={`${styles.item} ${styles.right}`}>
                {Number(
                  (item.trade_price * item.trade_volume).toFixed(0)
                ).toLocaleString()}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
