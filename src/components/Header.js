import styled from "styled-components";

const Header = ({ text, onTextClick }) => {
  return (
    <Container>
      <Wrapper>
        <HeaderText>{text}</HeaderText>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  max-width: 840px;
  height: 92px;
  color: #0d1f3c;
  background-color: #e0e9f8;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
`;

const HeaderText = styled.p`
  font-size: 26px;
  font-weight: 600;
  line-height: 32px;
`;

const Text = styled.p`
  font-size: 26px;
  font-weight: 600;
  line-height: 32px;
`;

export default Header;
