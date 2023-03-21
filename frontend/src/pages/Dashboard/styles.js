import styled from "styled-components";
import theme from "../../styles/theme";

export const Wrapper = styled.main`
  width: 100%;
  padding: 2rem;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const CardText = styled.p`
    font-size: 32px;
    color: ${props => theme.colors[props.color]};

`

export const Cards4Row = styled.div`
  > div {
    width: 24%;
  }
`

export const Cards2Row = styled.div`
  > div {
    width: 49.3%;
  }
`
