import styled from "styled-components";
import theme from "../../styles/theme";

export const Wrapper = styled.main`
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const Divisor = styled.div`
 ${({ float }) => `
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;

    > div:is(:first-child) {
      margin-right: 16px;
    }

    ${float && `
      position: relative;
      float: ${float};
      text-align: ${float};
    `}
 `}
`;

export const Footer = styled.footer`
  width: 100%;
  height: 3rem;
  background-color: red;
`;

export const Total = styled.div`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  position: relative;
  float: right;
  width: 380px;
  justify-content: space-between;

  :not(:last-of-type) {
    margin-bottom: 12px;
  }

  > div:not(:first-of-type) {
    display: inline-block;
    color: black;
    padding: 16px;
    background-color: rgba(0,0,0,0.05);
    box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
    border-radius: 10px;
    width: 50%;
    text-align: center;
  }

  > div:is(:first-of-type) {
    display: inline-block;
    color: black;
    padding: 16px;
  }
`;

export const CardText = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: ${props => theme.colors[props.color]};
`;

export const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  > div {
    width: 40%;
    height: 100%;

    :not(:last-of-type) {
      margin-right: 12px;
    }
  }
`;

export const PdfPreview = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  max-height: 80vh;
  overflow: scroll;
  background-color: gray;

  > div {
    background-color: white;
    transform: scale(0.8);
    padding: 2em;
    width: 21cm;
    height: 29.7cm;
  }
`;

export const PdfOptions = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
  flex-direction: column;

  > :not(:first-of-type) {
    margin-top: 12px;
  }
`;
