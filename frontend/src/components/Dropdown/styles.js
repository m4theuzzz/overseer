import { css, DefaultTheme, keyframes } from 'styled-components'
import styled from 'styled-components'

const wrapperModifiers = {
  active: (theme) => css`
    ${DropdownButton} {


      box-shadow: ${theme.shadows.blue};
    }
  `
}

const FadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }

`

export const AllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 1rem;
`

export const Wrapper = styled.div`
  ${({ theme, isActive }) => css`
    width: 100%;
    position: relative;

    ${isActive && wrapperModifiers.active(theme)}

    .loadingWrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
    }
  `}
`

export const DropdownButton = styled.div`
  ${({ theme }) => css`
    font-weight: ${theme.font.xbold};
    max-height: 3.2rem;
    transition: 0.2s;
    padding: 0.4rem 1rem;
    font-size: ${theme.font.sizes.xsmall};
    border: 1px solid ${theme.colors.cian};
    border-radius: ${theme.border.radius};
    background-color: ${theme.colors.white};
    color: ${theme.colors.grey};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;


    &:hover {
      > section {
        display: block;
      }
    }

    svg {
      position: absolute;
      width: 1rem;
      right: 2rem;
    }

    span {
      margin-left: 0.5rem;
      animation: ${FadeIn} 0.5s;
    }
  `}
`
export const Label = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.grey};
    font-size: ${theme.font.sizes.xsmall};
    margin-bottom: 0.7rem;
    margin-left: 0.3rem;
    font-weight: ${theme.font.xbold};
  `}
`

const budgetModifiers = {
  unactive: (theme) => css`
    color: ${theme.colors.cian};
    border: 1px solid ${theme.colors.cian};
    pointer-events: none;
  `,

  plustag: () => css`
    cursor: default;
  `
}


export const SelectedBudget = styled.div`
  ${({ theme, isActive, plustag }) => css`
    padding: 0 0.7rem;
    margin-left: 1rem;
    max-width: 5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: ${theme.font.sizes.xsmall};
    border: 1px solid ${theme.colors.yellow};
    color: ${theme.colors.yellow};
    border-radius: ${theme.border.radius};
    cursor: default;
    transition: 0.3s;
    animation: ${FadeIn} 0.2s;
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.yellow};
      color: ${theme.colors.white};
    }

    ${!isActive && budgetModifiers.unactive(theme)}
    ${!!plustag && budgetModifiers.plustag()}
  `}
`

export const InputWrap = styled.div`
  ${({ theme }) => css`
    position: absolute;
    width: 95%;
    margin-left: 2.5%;
    height: 4rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.colors.cian};
    z-index: 10;
    animation: ${FadeIn} 0.5s;

    > div {
      width: 90%;
    }
  `}
`

export const DropdownContent = styled.div`
  ${({ theme }) => css`
    border-radius: 0 0 ${theme.border.radius} ${theme.border.radius};
    border: 1px solid ${theme.colors.cian};
    position: absolute;
    top: 5rem;

    background-color: ${theme.colors.white};
    width: 95%;
    margin-left: 2.5%;
    max-height: 250px;
    overflow: scroll;
    overflow-x: hidden;
    box-shadow: 3px 3px 10px 6px rgba(0, 0, 0, 0.06);
    animation: ${FadeIn} 0.5s;
    z-index: 20;

    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background-color: ${theme.colors.lightWhite};
      border-radius: 40px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.cian};
      border-radius: 40px;
    }
  `}
`

export const ErrorBox = styled.div`
  ${({ theme }) => css`
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.colors.cian};
  `}
`

export const DropdownItem = styled.div`
  ${({ theme }) => css`
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f4f4f4;
    }
    > div {
      font-size: ${theme.font.sizes.xsmall};
      padding: 10px;
    }
  `}
`
