import React, { useState } from 'react';
import ReactDom from 'react-dom';

import MainPage from './MainPage';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
  return <MainPage />
}

ReactDom.render(<App />, mainElement);

