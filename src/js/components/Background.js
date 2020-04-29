import React from 'react';

export default function Background({ tiles, tileSize }) {
    return (
        <div className="background">
            {tiles.map(t => <div key={t} style={{width:tileSize,height:tileSize}} />)}
        </div>
    );
}