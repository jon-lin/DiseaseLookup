import ReactDOM from 'react-dom';
import React from 'react';
import Slides from './components/Slides';
import SplashPage from './components/SplashPage';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<Slides />, root);
});
