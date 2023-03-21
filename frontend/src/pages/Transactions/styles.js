import styled from "styled-components";
import Building from "../../images/building.jpg";
import theme from "../../styles/theme";

export const Wrapper = styled.main`
  width: 100%;
  padding: 2rem;
`;

export const TwoColumns = styled.div`

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;

`;

export const TwoButtons = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export const ThreeColumns = styled.div`

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2rem;

`;

export const CardText = styled.p`
    font-size: 32px;
    color: ${props => theme.colors[props.color]};

`;

export const CardWrapper = styled.div`
  display: flex;
  felx-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 24px 0 24px 0;

  > div {
    min-width: 23%;
  }
`;

export const NF = styled.img`
  max-width: 100%;
  width: auto;
  height: 100%;
  object-fit: contain;
  border: 3px dotted #000000;
  cursor: pointer;
`;
