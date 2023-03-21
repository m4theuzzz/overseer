import React from "react";
import Button from "../Button";
import * as S from "./styles";

const Card = ({ children, title, centeredValue }) => {
  return (
    <S.Wrapper>

      <S.Title>{title}</S.Title>
      <S.Content centered={centeredValue}>{children}</S.Content>

    </S.Wrapper>
  );
};

export default Card;
