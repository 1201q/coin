import Link from "next/link";
import styled from "styled-components";
import CoinComponent from "./Main/CoinComponent";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const List = ({ coinList, params }) => {
  return (
    <Container>
      {params && (
        <ActionContainer>
          <BtnBox>
            <ActionBtn>1</ActionBtn>
            <ActionBtnText>거래하기</ActionBtnText>
          </BtnBox>
          <BtnBox>
            <ActionBtn>1</ActionBtn>
            <ActionBtnText>호가</ActionBtnText>
          </BtnBox>
          <BtnBox>
            <ActionBtn>1</ActionBtn>
            <ActionBtnText>거래내역</ActionBtnText>
          </BtnBox>
          <BtnBox>
            <ActionBtn>1</ActionBtn>
            <ActionBtnText>정보</ActionBtnText>
          </BtnBox>
        </ActionContainer>
      )}
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
  padding-top: 24px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 4px;
  margin-bottom: 30px;
  height: 77px;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ActionBtn = styled.button`
  width: 49px;
  height: 49px;
  background: #edf1f9;
  box-shadow: 0px 2px 3px rgba(20, 70, 150, 0.15);
  border-radius: 16px;
  border: none;
  cursor: pointer;
  color: #000000;
`;

const ActionBtnText = styled.p`
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: #0d1f3c;
  text-align: center;
  margin-top: 6px;
`;

export default List;
