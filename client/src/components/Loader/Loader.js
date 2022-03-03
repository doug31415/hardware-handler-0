import React from 'react';
import './Loader.css';

function Loader({ message }) {
  return (
    <span className="loader-wrapper">
      <div className="loader" />
      <p className="loading-message">{message}</p>
    </span>
  );
}

export default Loader;
