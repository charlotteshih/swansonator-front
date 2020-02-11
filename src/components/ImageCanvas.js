import React, { useState } from 'react';
import './ImageCanvas.css';
import { UNSPLASH_CLIENT_KEY } from '../config';

const ImageCanvas = () => {
  const [bgImage, setBgImage] = useState('')
  const [caption, setCaption] = useState('');
  const [captionFont, setCaptionFont] = useState('sans-serif');
  const [textTransform, setTextTransform] = useState('none');
  const [captionColor, setCaptionColor] = useState('#000000');
  const [textShadow, setTextShadow] = useState('none')
  const [creditLink, setCreditLink] = useState('/');
  const [creditName, setCreditName] = useState('...');

  let canvasStyle = {
    backgroundImage: `url("${bgImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }

  let captionStyle = {
    fontWeight: 'bold',
    fontSize: '2rem',
    fontFamily: `${captionFont}`,
    color: `${captionColor}`,
    textTransform: `${textTransform}`,
    textShadow: `${textShadow}`
  };

  let captionLabelStyle = {
    fontWeight: 'bold',
    color: `${captionColor}`
  }

  function handleRandomQuote() {
    fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .then(response => {
      if(!response.ok) {
        throw new Error();
      } else {
        response.json().then(responseJSON => setCaption(responseJSON[0]))
      }
    });
  }

  function handleRandomImage() {
    fetch('https://api.unsplash.com/photos/random?orientation=landscape', {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_CLIENT_KEY}`
      }
    })
      .then(response => {
        if(!response.ok) {
          throw new Error();
        } else {
          response.json().then(responseJSON => {
            setBgImage(responseJSON.urls.full);
            setCreditLink(responseJSON.user.links.html);
            setCreditName(responseJSON.user.name);
          })
        }
      });
  }

  function handleFontChange(e) {
    setCaptionFont(e.target.value);
  }

  function handleToggleCaps() {
    let checkbox = document.getElementById('text-transform');
    checkbox.checked ? setTextTransform('uppercase') : setTextTransform('none');
  }

  function handleCaptionColorChange(e) {
    setCaptionColor(e.target.value);
  }

  function handleToggleShadow() {
    let checkbox = document.getElementById('text-shadow');
    checkbox.checked ? setTextShadow('2px 2px 9px rgba(150, 150, 150, 1)') : setTextShadow('none');
  }

  return (
    <>
      <div style={canvasStyle} className="canvas">
        <div style={captionStyle} className="text">{caption}</div>
        {bgImage.length > 0
          ? <div className="credit">Photo by: <a href={creditLink} target="_blank" rel="noopener noreferrer">{creditName}</a> @ Unsplash.</div>
          : ''}
      </div>
      <button onClick={handleRandomQuote}>Generate Random Quote</button>
      <button onClick={handleRandomImage}>Generate Random Image</button>

      <form>
        <label htmlFor="select-font">Select Font: </label>
        <select id="select=font" onChange={e => handleFontChange(e)}>
          <option value={captionFont}>Select a font...</option>
          <option value="sans-serif">Sans Serif</option>
          <option value="seris">Serif</option>
        </select>

        <input
          type="checkbox"
          id="text-transform"
          name="text-transform"
          value={textTransform}
          onChange={handleToggleCaps} />
        <label htmlFor="text-transform"> Toggle Caps</label>
        <br />
        <label htmlFor="select-color">Select Color: </label>
        <input
          type="color"
          id="select-color"
          name="select-color"
          value={captionColor}
          onChange={e => handleCaptionColorChange(e)} />

        <span style={captionLabelStyle}> {captionColor}</span>
        <input
          type="checkbox"
          id="text-shadow"
          name="text-shadow"
          value={textShadow}
          onChange={handleToggleShadow} />
        <label htmlFor="text-shadow"> Text Shadow</label>
      </form>
      {/* <button onClick={handleFontChange}>Change Font</button> */}
    </>
  );
}

export default ImageCanvas;