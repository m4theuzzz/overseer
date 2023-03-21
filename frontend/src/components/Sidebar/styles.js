import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import theme from "../../styles/theme";

export const SidebarContainer = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  padding: 10px;
  height: 100vh;
  width: 250px;
  background-color: #334257;
  transition: 0.5s;
  z-index: var(--z-fixed);
  box-shadow: 0px 0px 16px rgba(0,0,0,0.7);

  & {
    @media print {
      display: none;
    }
  }
`;

export const SidebarMenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const StyledNavLink = styled(Link)`
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 1rem;
  margin: 20px 0 0 20px;
  text-decoration: none;
  font-size: 16px;

  span {
    color: #ffffff;
    font-weight: 100;
  }
  &:hover {
    color: blue;
    opacity: 100%;
  }
  &:hover {
    text-decoration: underline;
  }

  &&.active {
    color: white;
    font-size: 20px;
    font-weight: 1000;
  }
  &&.active::before {
    content: '•';
  }
`;

export const LogoContainer = styled.img`
  width: 200px !important;
  margin: 0 auto;
  margin-bottom: 20px;
`;

export const AvatarContainer = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 100%;
  border: 3px solid #ffffff;
  cursor: pointer;
`;

export const UserInfo = styled.p`
  font-size: ${theme.font.sizes.medium};
  color: #ffffff;
  margin-top: 20px;
  margin-bottom: 20px;
  strong {
    font-weight: 500;
  }
`;

export const UserDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const OldImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  border: 3px solid #ffffff;
  object-fit: cover;
`;

export const NewImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  border: 3px dotted #ffffff;
  cursor: pointer;
  object-fit: cover;
`;

export const UpdateImagesHolder = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;
