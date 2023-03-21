import styled from "styled-components";

export const Wrapper = styled.main`
  width: 100%;
  padding: 2rem;
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
