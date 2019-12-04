import React, { ReactElement } from "react";
import { ThemeProvider } from "styled-components";

export function App() {
  return (
    <AppProvider>
      <div>These examples are empty!</div>
    </AppProvider>
  );
}

function AppProvider({ children }: { children?: ReactElement }) {
  return <ThemeProvider theme={{}}>{children}</ThemeProvider>;
}
