import React, { useState } from 'react'
import * as S from './styles'

const PageHeader = ({ title, subtitle, onBack }) => {

  return (
    <S.Wrapper>
      {!!onBack &&
        <S.Back onClick={() => onBack()}>{'<'}</S.Back>
      }
      <S.Title>{title}</S.Title>
      {!!subtitle &&
        <S.Subtitle>{subtitle}</S.Subtitle>
      }
    </S.Wrapper>
  )
}

export default PageHeader