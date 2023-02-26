import React from 'react';
import { 
  BrowserRouter
} from 'react-router-dom';

import Dashboard from './layouts';

function App() {
  return (
      <BrowserRouter basename='/'>
        <Dashboard />
      </BrowserRouter>
  );}

export default App;
