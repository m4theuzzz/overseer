import styled, { css, keyframes } from 'styled-components'

const PulseBefore = (color, theme) => keyframes`

0% {
    box-shadow: 9984px 0 0 -5px ${theme.colors[color]};
  }
  30% {
    box-shadow: 9984px 0 0 2px ${theme.colors[color]};
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px ${theme.colors[color]};
  }



`

const Pulse = (color, theme) => keyframes`
 0% {
    box-shadow: 9999px 0 0 -5px ${theme.colors[color]};
  }
  30% {
    box-shadow: 9999px 0 0 2px ${theme.colors[color]};
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px ${theme.colors[color]};
  }

`

const PulseAfter = (color, theme) => keyframes`

  0% {
    box-shadow: 10014px 0 0 -5px ${theme.colors[color]};
  }
  30% {
    box-shadow: 10014px 0 0 2px ${theme.colors[color]};
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px ${theme.colors[color]};
  }


`

const wrapperModifiers = {
  small: () => css`
    zoom: 0.4;
  `
}

export const Wrapper = styled.section`
  ${({ theme, color, small }) => css`
    position: relative;
    left: -9999px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #e3a909;
    color: #e3a909;
    box-shadow: 9999px 0 0 -5px #e3a909;
    animation: ${Pulse(color, theme)} 1.5s infinite linear;
    animation-delay: 0.25s;

    &:before,
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #e3a909;
      color: #e3a909;
    }

    &:before {
      box-shadow: 9984px 0 0 -5px #e3a909;
      animation: ${PulseBefore(color, theme)} 1.5s infinite linear;
      animation-delay: 0s;
    }

    &:after {
      box-shadow: 10014px 0 0 -5px #e3a909;
      animation: ${PulseAfter(color, theme)} 1.5s infinite linear;
      animation-delay: 0.5s;
    }

    ${small && wrapperModifiers.small()}
  `}
`
