/* jslint esnext: true */

import React from 'react';
import UnidocsApp from '../components/UnidocsApp';
import ReactTapEventPlugin from 'react-tap-event-plugin';

global.__SERVER__ = false;
ReactTapEventPlugin();

React.render(<UnidocsApp initialPath={location.pathname} />, document.getElementById('content'));
