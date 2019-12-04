import React, { ReactElement } from "react";
import styled, { ThemeProvider } from "styled-components";

export function App() {
  return (
    <AppProvider>
      <Aaa>
        <div>These examples are empty!</div>
      </Aaa>
    </AppProvider>
  );
}

const Aaa = styled.div`
  padding: 4rem;
`;

function AppProvider({ children }: { children?: ReactElement }) {
  return <ThemeProvider theme={{}}>{children}</ThemeProvider>;
}
