import React from 'react';

import { SessionProvider } from './libs/session';

import CssBaseline from '@material-ui/core/CssBaseline';

import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {

  return (
    <SessionProvider serviceHost={prefix}>
      <CssBaseline />
      <Main />
    </SessionProvider>
  );
}

export default App;
