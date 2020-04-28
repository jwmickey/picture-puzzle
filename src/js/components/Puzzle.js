import React, { useEffect, useState } from 'react';
import useGame from '../hooks/useGame';
import Tile from './Tile';
import Controls from './Controls';
import Winner from './Winner';

function Puzzle({ game, onExit }) {
    const [G, setG] = useState(game);
    const { positions } = useGame(G);

    // handle keypress
    useEffect(() => {
        function handleKeyDown(event) {
            let direction;
            switch (event.keyCode) {
                case 37:    direction = 'left';     break;
                case 38:    direction = 'up';       break;
                case 39:    direction = 'right';    break;
                case 40:    direction = 'down';     break;
                default:    return false;
            }
            G.moveInDirection(direction);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [G]);

    const { tileSize, gridSize, image } = G.getConfig();
    const numTiles = gridSize * gridSize;

    return (
        <div className="puzzle">
            <div className="squares">
                {game.isSolved() && <Winner close={onExit} image={image} />}
                {game.tiles.map(id => (
                    <Tile key={id}
                          id={id}
                          image={image}
                          gridSize={gridSize}
                          tileSize={tileSize}
                          position={positions[id]}
                          isBlank={id === numTiles - 1} />
                ))}
            </div>
            <Controls handleMove={d => G.moveInDirection(d)}
                      handleExit={onExit}
                      handleReset={() => G.reset()} />
        </div>
    );
}

export default Puzzle;