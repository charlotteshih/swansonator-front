import React from 'react';
import ReactDOM from 'react-dom'
import ImageCanvas from '../components/ImageCanvas';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImageCanvas />, div);
  ReactDOM.unmountComponentAtNode(div);
});
