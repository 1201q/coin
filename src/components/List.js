import Link from "next/link";
import styled from "styled-components";
import CoinComponent from "./Main/CoinComponent";
import { motion } from "framer-motion";

const List = ({ coinList }) => {
  return (
    <Container>
      {coinList.map((coinData) => (
        <Link href={`/info/${coinData.market}`} key={coinData.market}>
          <CoinComponent
            icon={coinData.market.replace("KRW-", "")}
            krName={coinData.korean_name}
            code={coinData.market}
            price={0}
            percent={0}
          />
        </Link>
      ))}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 840px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
`;

export default List;
