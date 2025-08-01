import React from 'react';
import Game from './game/Game';

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Robot Color Jam</h1>
      <Game />
    </div>
  );
};

export default App;
