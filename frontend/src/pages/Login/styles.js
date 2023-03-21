import styled from "styled-components";
import Building from "../../images/building.jpg";
import theme from "../../styles/theme";

export const Wrapper = styled.main`
  height: 100vh;

  background-image: url(${Building});
  background-size: cover;
  background-position: center;

  display: flex;
  justify-content: flex-end;
`;

export const AsideBox = styled.aside`
  position: relative;
  min-width: 600px;
  height: 100%;
  background-color: white;
  padding: 3rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > img {
    width: 180px;
  }
`;

export const WelcomeBox = styled.div`
  font-size: ${theme.font.sizes.small};
  color: ${theme.colors.lightGrey};
  margin-bottom: 2rem;

  strong {
    font-weight: 500;
  }
`;

export const FieldsBox = styled.div``;

export const FormBox = styled.div`
  button {
    width: 100%;
    padding: 0.5rem;
    margin-top: 1rem;
  }

  display: flex;
  flex-direction: column;
`;

export const BottomImg = styled.img`
 width: 230px !important;
 margin: 0 auto;

`

export const CirclesImg = styled.img`
position: absolute;
top: 0;
right: 0;
width: 150px !important;

`
