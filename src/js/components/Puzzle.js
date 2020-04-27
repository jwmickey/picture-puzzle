import React, { useEffect, useState } from 'react';
import debounce from 'debounce';
import useGame from '../hooks/useGame';
import Tile from './Tile';
import Controls from './Controls';

function Puzzle({ game, onFinish, onExit }) {
    const [G, setG] = useState(game);
    const { positions } = useGame(G);

    // handle resize events
    useEffect(() => {
        const resize = debounce(() => {
            G.setScreenSize(Math.min(window.innerWidth, window.innerHeight));
        }, 500);

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [G]);

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

    if (G.isSolved()) {
        return (
            <div onClick={() => {
                    G.clear();
                    onFinish();
                 }}
                 className="winner"
                 style={{backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
        );
    } else {
        return (
            <div className="puzzle">
                <div className="squares">
                    {[...Array(numTiles).keys()].map(id => (
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
}

export default Puzzle;