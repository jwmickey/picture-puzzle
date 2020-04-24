import React from 'react';

function Tile({ id, isBlank, image, position, tileSize, gridSize, handleClick }) {
    const gridSqrt = Math.sqrt(gridSize);

    // calculate selection of image to display
    const bgOffset = 1 / gridSqrt;
    const bgX = (id % gridSqrt) * 500 * bgOffset;
    const bgY = Math.floor(id / gridSqrt) * 500 * bgOffset;
    const backgroundImage = `url(${image})`;
    const backgroundPosition = `-${bgX}px -${bgY}px`;

    // calculate css translate position
    const origX = id % gridSqrt;
    const origY = Math.floor(id / gridSqrt);
    const destX = position % gridSqrt;
    const destY = Math.floor(position / gridSqrt);
    const offsetX = (destX - origX) * tileSize;
    const offsetY = (destY - origY) * tileSize;

    return (
        <div style={{
            backgroundImage: isBlank ? 'none' : backgroundImage,
            backgroundPosition,
            order: id,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            transition: 'transform 75ms ease-in-out'
        }} onClick={handleClick} />
    );
}

export default Tile;