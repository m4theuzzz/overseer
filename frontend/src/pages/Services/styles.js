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

export const ThreeColumns = styled.div`

  display: grid; 
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2rem;

`;
