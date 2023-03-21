import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
*{
  padding: 0;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: #334257;
    border-radius: 3px;
  }

  a{
    text-decoration: none;
    :hover{
      text-decoration: none !important;
      color: white;
    }
  }
}

body {
  font-family: 'Maven Pro';
  font-size: 1.6rem;
}
`
