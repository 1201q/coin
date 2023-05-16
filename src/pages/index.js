import styled from "styled-components";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";
import List from "@/components/List";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Home({ coinList }) {
  const [data, setData] = useState(0);
  const wsRef = useRef(null);

  useEffect(() => {
    startWebsocket();

    return () => {
      closeWebsocket();
    };
  }, []);

  function startWebsocket() {
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsRef.current = ws;
    try {
      ws.onopen = () => {
        ws.send(`[{"ticket" : "2"}, {"type" : "ticker","codes": ["KRW-BTC"]}]`);
        console.log("코인리스트 웹소켓 열림");
      };

      ws.onmessage = async (e) => {
        const { data } = e;
        const text = await new Response(data).json();

        console.log(text);
        setData(text.trade_price);
      };
    } catch (e) {
      console.log(e);
    }
  }

  function closeWebsocket() {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }

  return (
    <Container>
      <Wrapper>
        <Header text={"리스트"} /> {data}
        <motion.div layoutId="coinList">
          <List coinList={coinList} />
        </motion.div>
      </Wrapper>
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await axios
    .get("https://api.upbit.com/v1/market/all")
    .then((res) => {
      return res.data;
    });

  const coinList = res.filter((item) => {
    if (item.market.slice(0, 3) === "KRW") {
      return item;
    }
  });

  return { props: { coinList } };
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 840px;
  background-color: #e0e9f8;
  color: #0d1f3c;
`;
