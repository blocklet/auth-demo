import React from 'react';
import { getWebWalletUrl } from './libs/util';
import { SessionProvider } from './libs/session';

import CssBaseline from '@material-ui/core/CssBaseline';

import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {
  const webWalletUrl = getWebWalletUrl();

  return (
    <SessionProvider serviceHost={prefix} webWalletUrl={webWalletUrl}>
      <CssBaseline />
      <Main />
    </SessionProvider>
  );
}

export default App;
