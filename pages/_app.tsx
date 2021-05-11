import { createGlobalStyle, ThemeProvider } from "styled-components";
import * as React from "react";

const GlobalStyle = createGlobalStyle`
  body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  } 
`;

export const theme = {
  font: {
    colors: {
      white: "#ffffff",
      darkGray: "#ffffff99",
      gray: "#ffffff30",
      lightGray: "#ffffff15",
    },
    weight: {
      light: 200,
      regular: 400,
      bold: 600,
      bolder: 800,
    },
    size: {
      xxs: 4,
      xs: 8,
      s: 12,
      m: 16,
      l: 20,
      xl: 24,
      xxl: 28,
      largest: 48,
    },
  },
  colors: {
    primary: "#0070f3",
    background: "#1d1f21",
    error: "#ed4245",
    success: "#3ba55c",
    warning: "#faa61a",
  },
};

function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default App;
