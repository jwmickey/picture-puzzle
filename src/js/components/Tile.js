import React from 'react';

function Tile({ position, bgX, bgY, handleClick }) {
    return (
        <div style={{
            backgroundPosition: `-${bgX}px -${bgY}px`,
            order: position
        }} onClick={handleClick} />
    );
}

export default Tile;