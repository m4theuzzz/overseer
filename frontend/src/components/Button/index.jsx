import React from 'react'
import * as S from './styles'

const Button = ({ children, disabled, secondary, floatRight, onButtonClick }) => {
  return (
    <S.Wrapper floatRight={floatRight} disabled={disabled} secondary={secondary} onClick={onButtonClick}>
      {children}
    </S.Wrapper>
  )
}

export default Button;