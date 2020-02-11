import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './ImageCanvas.css';
import { UNSPLASH_CLIENT_KEY } from '../config';

const ImageCanvas = () => {
  const [bgImage, setBgImage] = useState('')
  const [caption, setCaption] = useState(<p>Welcome to the Swansonator!<br />To get started, click the 'Randomize' button.</p>);
  const [captionFont, setCaptionFont] = useState('sans-serif');
  const [textTransform, setTextTransform] = useState('none');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [captionColor, setCaptionColor] = useState('#000000');
  const [textShadow, setTextShadow] = useState('none');
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
    fontSize: '3rem',
    fontFamily: `${captionFont}`,
    color: `${captionColor}`,
    textTransform: `${textTransform}`,
    textShadow: `${textShadow}`
  };

  let captionLabelStyle = {
    fontWeight: 'bold',
    color: `${captionColor}`
  };

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

  function handleRandomBoth() {
    handleRandomQuote();
    handleRandomImage();
  }

  function handleFontChange(e) {
    setCaptionFont(e.target.value);
  }

  function handleToggleCaps() {
    let checkbox = document.getElementById('text-transform');
    checkbox.checked ? setTextTransform('uppercase') : setTextTransform('none');
  }

  function handleShowColorPicker(e) {
    e.preventDefault();
    setShowColorPicker(!showColorPicker);
  }

  function handleCaptionColorChange(color) {
    setCaptionColor(color.hex);
  }

  function handleToggleTextShadow() {
    let checkbox = document.getElementById('text-shadow');
    checkbox.checked
    ? setTextShadow('2px 2px 9px rgba(150, 150, 150, 1)')
    : setTextShadow('none');
  }

  return (
    <main className="workspace">
      <article style={canvasStyle} className="canvas">
        <section style={captionStyle} className="canvas__text">{caption}</section>
        {bgImage.length > 0
          ? <section className="canvas__unsplash-credit">Photo by: <a href={creditLink} target="_blank" rel="noopener noreferrer">{creditName}</a> @ Unsplash.</section>
          : ''}
      </article>

      <article className="customize">
        <section className="customize__canvas">
          <h3 className="customize__header">Generate Quote & Image</h3>
          <button className="customize__button btn--generator" onClick={handleRandomBoth}>Randomize</button>
          <button className="customize__button btn--generator" onClick={handleRandomQuote}>Random Quote</button>
          <button className="customize__button btn--generator" onClick={handleRandomImage}>Random Image</button>
        </section>

        <section className="customize__font">
          <h3 className="customize__header">Customize Fonts</h3>
          <form>
            <select id="select-font" onChange={e => handleFontChange(e)}>
              <option value={captionFont}>Select a font...</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="seris">Serif</option>
            </select>
            <br />
            <input
              type="checkbox"
              id="text-transform"
              name="text-transform"
              value={textTransform}
              onChange={handleToggleCaps} />
            <label htmlFor="text-transform"> Capitalize</label>
          </form>
        </section>

        <section className="customize__color">
          <h3 className="customize__header">Customize Colors</h3>
          <p>
            Caption Color: <span style={captionLabelStyle}>{captionColor} </span>
            <button className="customize__button" onClick={e => handleShowColorPicker(e)}>Set Caption Color...</button>
          </p>
          {showColorPicker === true
            ? <section className="customize__color--picker">
                <section className="customize__color--cover" onClick={e => handleShowColorPicker(e)} />
                <SketchPicker
                  color={captionColor}
                  onChange={color => handleCaptionColorChange(color)} />
                <section className="customize__color--tooltip"></section>
              </section>
            : '' }

          <form>
            <input
              type="checkbox"
              id="text-shadow"
              name="text-shadow"
              value={textShadow}
              onChange={handleToggleTextShadow} />
            <label htmlFor="text-shadow"> Text Shadow</label>
          </form>
        </section>
      </article>
    </main>
  );
}

export default ImageCanvas;