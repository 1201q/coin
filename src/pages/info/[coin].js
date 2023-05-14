import styled from "styled-components";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import List from "@/components/List";
import axios from "axios";
import { motion } from "framer-motion";
import CoinInfo from "@/components/CoinInfo";

const Info = ({ coinList, params }) => {
  const router = useRouter();

  return (
    <Container>
      <Wrapper>
        <Header text={params.coin} bgColor={"#347af0"} fontColor={"white"} />
        <CoinInfo />
        <motion.div layoutId="coinList">
          <List coinList={coinList} />
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export async function getServerSideProps({ params: params }) {
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

  return { props: { params, coinList } };
}

const Container = styled.div`
  width: 100%;
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
  background-color: #347af0;

  color: #0d1f3c;
`;

export default Info;
