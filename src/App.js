import React from 'react';
import Slider from './Slider'; 
const App = () => {
  return (
    <div>
      <h1>Слайдер 1</h1>
      <Slider displayTime={5000} slidesToShow={3} />

      <h1>Слайдер 2</h1>
      <Slider displayTime={6000} slidesToShow={2} />
    </div>
  );
};

export default App;
