import React from 'react';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';
import { create } from '@arcblock/ux/lib/Theme';
import { SessionProvider } from './libs/session';

import CssBaseline from '@mui/material/CssBaseline';

import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}
const theme = create();

function App() {

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <SessionProvider serviceHost={prefix}>
            <CssBaseline />
            <Main />
          </SessionProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
