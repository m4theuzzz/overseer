import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
export const Title = styled.div`
  font-size: 38px;
  font-weight: 500;
  color: #476072;

  &::before {
    content: '|';
    font-size: 50px;
  }
`;

export const Subtitle = styled.div`
  font-size: 24px;
  font-weight: 0;
  color: #476072;
  margin-top: 16px;

  &::before {
    content: '•';
    font-weight: 1000;
    margin: 12px 12px 0 12px;
  }
`;

export const Back = styled.button`
  z-index: 10;
  color: #476072;
  font-size: 50px;
  font-weight: 400;
  background: transparent;
  border: none;
  border-radius: 100%;
  transaction: 0.5s;
  cursor: pointer;

  & :hover {
    background: rgba(0,0,0,0.2);
  }
`;
