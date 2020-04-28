import React, { useMemo } from 'react';

function Tile({ id, isBlank, image, position, tileSize, gridSize }) {
    // calculate selection of image to display
    const background = useMemo(() => {
        const bgOffset = 1 / gridSize;
        const bgX = (id % gridSize) * 500 * bgOffset;
        const bgY = Math.floor(id / gridSize) * 500 * bgOffset;
        return `url(${image}) -${bgX}px -${bgY}px / 500px 500px no-repeat`;
    }, [image, gridSize, id]);

    // calculate css translate position
    const transform = useMemo(() => {
        const origX = id % gridSize;
        const origY = Math.floor(id / gridSize);
        const destX = position % gridSize;
        const destY = Math.floor(position / gridSize);
        const offsetX = (destX - origX) * tileSize;
        const offsetY = (destY - origY) * tileSize;
        return `translate(${offsetX}px, ${offsetY}px)`;
    }, [id, position, tileSize, gridSize]);

    return (
        <div style={{
            background: isBlank ? '#eee' : background,
            color: !!image ? 'transparent' : 'black',
            width: tileSize,
            height: tileSize,
            order: id,
            transform,
        }}>{!isBlank && (id + 1)}</div>
    );
}

export default Tile;