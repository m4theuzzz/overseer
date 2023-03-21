import React from "react";
import Sidebar from "../../components/Sidebar";
import * as S from "./styles";

const Layout = ({ children, perm }) => {
  return (
    <S.Wrapper>
      {!!perm &&
        <Sidebar perm={perm} />
      }

      {children}
    </S.Wrapper>
  );
};

export default Layout;
