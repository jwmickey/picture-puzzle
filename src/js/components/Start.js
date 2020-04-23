import React, { useState } from 'react';

function Start({ gridSize, images, start, sizes }) {
    const [size, setSize] = useState(gridSize);
    const [imageIndex, setImageIndex] = useState(0);

    return (
        <div className="start">
            <div className="button-group">
                <h3>Number of Tiles</h3>
                {sizes.map(s => (
                    <button key={s}
                            className={size === s ? 'selected' : ''}
                            onClick={() => setSize(s)}>{s}</button>
                ))}
            </div>

            <div className="button-group images">
                <h3>Image</h3>
                {images.map((img, i) => (
                    <button key={img}
                            className={imageIndex === i ? 'selected' : ''}
                            onClick={() => setImageIndex(i)}>
                        <img src={img} alt="Preview" />
                    </button>
                ))}
            </div>

            <div className="button-group">
                <button onClick={() => start(size, images[imageIndex])}>Start Game</button>
            </div>
        </div>
    );
}

export default Start;
