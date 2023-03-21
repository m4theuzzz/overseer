import { css } from "@emotion/react";
import styled from "styled-components";
import theme from "../../styles/theme";

export const Wrapper = styled.main`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #476072;
  width: 100%;

  > div:not(:last-of-type) {
    margin-right: 12px;
  }
`;

export const Row = styled.div`
  ${({ theme, rowDisabled }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #555555;
    width: 100%;
    padding: 6px 12px;
    margin-top: 12px;

    background-color: rgba(0,0,0,0.05);
    border-radius: 10px;
    min-height: 32px;
    max-height: 64px;
    height: auto;
    box-shadow: 5px 5px 5px rgba(0,0,0,0.1);

    > div:not(:last-of-type) {
      margin-right: 12px;
    }

    ${rowDisabled && `text-decoration: line-through;`}
  `}
`;

export const Divisor = styled.label`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  > div:not(:first-child) {
    position: relative;
    top: 4px;
    left: -28px;
    z-index: 1000;
  }

  > div > svg {
    color: #555555;
  }
`;

export const Total = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: row;
  position: relative;
  float: left;
  margin: 8px 0 8px 12px;

  > div:not(:first-of-type) {
    display: inline;
    color: black;
    padding: 12px 6px 12px 6px;
    min-width: 150px;
    text-align: left;
  }

  > div:is(:first-of-type) {
    display: inline;
    color: #476072;
    padding: 12px 6px 12px 0;
  }
`;
