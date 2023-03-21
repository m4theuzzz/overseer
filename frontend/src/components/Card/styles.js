import styled from "styled-components";
import theme from "../../styles/theme";

export const Wrapper = styled.div`
  max-width: 80vw;

  background-color: ${theme.colors.whiteBg};
  box-shadow: ${theme.shadows.black};
  border-radius: 20px;
  margin-bottom: 12px;
`;

export const Title = styled.div`
  display: inline-block;
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  color: ${theme.colors.white};
  background-color: ${theme.colors.darkBlue};
  border-radius: 20px 0 20px 0;
  min-width: 10%;
  max-width: 80%;
  text-align: center;
`;

export const Content = styled.div`
  ${({ theme, centered }) => `
    padding: 6px 12px 12px 12px;

    >button{
        margin-top: 1rem;
    }

    ${!!centered && `
      height: calc(100% - 30px);
      display: flex;
      justify-content: center;
      align-items: center;
    `}
  `}
`;
