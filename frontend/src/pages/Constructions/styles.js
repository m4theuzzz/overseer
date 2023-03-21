import styled from "styled-components";

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

export const Divisor = styled.main`
   width: 100%;
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   justify-content: flex-start;

   > div {
     width: 50%;
   }

   > div:is(:first-child) {
     margin-right: 16px;
   }
 `;
