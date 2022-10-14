import React from 'react';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { SessionProvider } from './libs/session';
import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {

  return (
    <ThemeProvider>
      <SessionProvider serviceHost={prefix}>
        <Main />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
