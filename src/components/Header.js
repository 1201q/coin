import styled from "styled-components";

const Header = ({
  text,
  onTextClick,
  bgColor = "#e0e9f8",
  fontColor = "#0d1f3c",
}) => {
  return (
    <Container headercolor={fontColor} headerbgcolor={bgColor}>
      <Wrapper>
        <HeaderText>{text}</HeaderText>
        <OtherText></OtherText>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 840px;
  height: 130px;
  color: ${(props) => props.headercolor};
  background-color: ${(props) => props.headerbgcolor};
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;
const HeaderText = styled.p`
  font-size: 30px;
  font-weight: 600;
  margin-top: 50px;
`;
const OtherText = styled.div`
  height: 48px;
  margin-top: 8px;
  color: #485068;
`;

export default Header;
