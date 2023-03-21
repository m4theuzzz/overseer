import styled, { css } from 'styled-components'

const inputModifiers = {
  sufix: (content) => css`
    &&::after{
      content: '${content}';
    }
  `
}

export const Input = styled.input`
  ${({ theme, sufix }) => css`
    font-size: ${theme.font.sizes.xsmall};
    color: #555555;
    border-radius: ${theme.border.radius};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.cian};
    /* box-shadow: ${theme.shadows.black}; */
    width: 100%;
    transition: 1s;

    &:focus {
      outline: none;
      box-shadow: ${theme.shadows.blue};
    }

    ${sufix && inputModifiers.sufix(sufix)}
  `}
`

export const Label = styled.label`
  ${({ theme }) => css`
    color: ${theme.colors.grey};
    font-size: ${theme.font.sizes.xsmall};
    margin-bottom: 0.7rem;
    margin-left: 0.3rem;
    font-weight: ${theme.font.xbold};
  `}
`

export const Error = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.red};
    font-size: 15px;
    font-style: italic;
    margin-bottom: 1rem;
    transform: translateY(-7px);
  `}
`

export const InputWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`
const wrapperModifiers = {
  small: () => css`
    ${Input} {
      padding: 0.4rem 1rem;
    }
  `,
  large: () => css`
    ${Input} {
      padding: 0.7rem 1rem;
    }
  `,
  error: (theme) => css`
    ${Input} {
      border-color: ${theme.colors.red};
    }
  `
}

export const Wrapper = styled.div`
  ${({ theme, elsize, error }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    ${!!elsize && wrapperModifiers[elsize]()}
    ${error && wrapperModifiers.error(theme)}
  `}
`
