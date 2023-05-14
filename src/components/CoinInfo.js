import AreaChart from "@/components/AreaChart";
import styled from "styled-components";

const CoinInfo = () => {
  return (
    <Container>
      <CoinPrice>20,680,000원</CoinPrice>
      <CoinPercent>-0.50%</CoinPercent>
      <CoinChart>
        <AreaChart />
      </CoinChart>
      <ChartPeriodControl>
        <PeriodControlBtn isSelected={true}>1일</PeriodControlBtn>
        <PeriodControlBtn isSelected={false}>1주</PeriodControlBtn>
        <PeriodControlBtn isSelected={false}>3달</PeriodControlBtn>
        <PeriodControlBtn isSelected={false}>1년</PeriodControlBtn>
        <PeriodControlBtn isSelected={false}>상세</PeriodControlBtn>
      </ChartPeriodControl>
    </Container>
  );
};

const Container = styled.div`
  height: 400px;
  background-color: #347af0;
`;

const CoinPrice = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const CoinPercent = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: white;
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
`;

const CoinChart = styled.div`
  height: 230px;
  margin-top: 20px;
`;

const ChartPeriodControl = styled.div`
  display: flex;
  justify-content: space-around;
  height: 28px;
  margin: 20px 22px;
`;

const PeriodControlBtn = styled.button`
  width: 62px;
  height: 28px;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  background: ${(props) => !props.isSelected && "none"};
  opacity: ${(props) => !props.isSelected && 0.7};
`;

export default CoinInfo;
