import React, { useState } from 'react';
import CustomUpload from './CustomUpload';

const numbers = require('../../img/numbers.png').default;

function Start({ gridSize, images, start, sizes, customImage, saveCustomImage }) {
    const [size, setSize] = useState(gridSize);
    const [imageIndex, setImageIndex] = useState(-1);

    function handleStart() {
        if (imageIndex === images.length && customImage != null) {
            start(size, customImage);
        } else {
            start(size, images[imageIndex]);
        }
    }

    return (
        <div className="start">
            <div className="button-group">
                <h3>Number of Tiles</h3>
                {sizes.map(s => (
                    <button key={s}
                            className={size === s ? 'selected' : ''}
                            onClick={() => setSize(s)}>{s} &times; {s}</button>
                ))}
            </div>

            <div className="button-group images">
                <h3>Image</h3>
                <button className={imageIndex === -1 ? 'selected' : ''}
                        onClick={() => setImageIndex(-1)}>
                    <img src={numbers} alt="Just Numbers" />
                </button>
                {images.map((img, i) => (
                    <button key={img}
                            className={imageIndex === i ? 'selected' : ''}
                            onClick={() => setImageIndex(i)}>
                        <img src={img} alt="Preview" />
                    </button>
                ))}
                {customImage && (
                    <button key="custom"
                            className={imageIndex === images.length ? 'selected' : ''}
                            onClick={() => setImageIndex(images.length)}>
                        <img src={customImage} alt="Preview" />
                    </button>
                )}
            </div>

            <div className="button-group custom">
                <CustomUpload current={customImage} save={saveCustomImage} />
            </div>


            <div className="button-group">
                <button onClick={handleStart}>Start Game</button>
            </div>
        </div>
    );
}

export default Start;
