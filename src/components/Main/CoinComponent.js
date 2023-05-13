import Image from "next/image";
import styled from "styled-components";

const CoinComponent = () => {
  return (
    <Info>
      <CoinIcon>
        <Image
          src="https://static.upbit.com/logos/BTC.png"
          width={34}
          height={34}
        />
      </CoinIcon>
      <CoinContainer>
        <CoinNameBox>
          <CoinKrName>비트코인</CoinKrName>
          <CoinEnName>KRW-BTC</CoinEnName>
        </CoinNameBox>
        <CoinInfoBox>
          <CoinCurrentPrice>36,485,000</CoinCurrentPrice>
          <CoinPercent>+0.40%</CoinPercent>
        </CoinInfoBox>
      </CoinContainer>
    </Info>
  );
};
const Info = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  background: #edf1f9;
  box-shadow: 0px 2px 3px rgba(20, 70, 150, 0.15);
  border-radius: 30px;
  padding: 0px 18px;
`;

const CoinContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const CoinNameBox = styled.div`
  display: flex;

  flex-direction: column;
`;

const CoinInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

const CoinIcon = styled.div`
  margin-top: 3px;
  margin-right: 13px;
`;

const CoinKrName = styled.p`
  font-size: 19px;
  font-weight: 900;

  color: #0d1f3c;
`;

const CoinEnName = styled.p`
  font-size: 13px;
  font-weight: 400;

  color: #485068;
`;

const CoinCurrentPrice = styled.p`
  font-size: 17px;
  font-weight: 600;
  color: #0d1f3c;
`;

const CoinPercent = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #75bf72;
`;

export default CoinComponent;
