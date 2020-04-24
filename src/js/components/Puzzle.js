import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'debounce';
import Tile from './Tile';
import Controls from './Controls';
import { calcDimensions, saveGame, loadGame, getTargetPosition, calcTileMovement, mixUpTiles, isSolved } from '../util/game';

const DEFAULT_CONFIG = {
    sqrt: 4,
    bgOffset: 1 / 500,
    tileSize: 125,
    imageSize: 500
};

function Puzzle({ gridSize, image, onFinish, exit }) {
    const [tilePositions, setTilePositions] = useState([]);
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    // initial setup
    useEffect(() => {
        let positions = loadGame(image);
        if (positions === null) {
            // start a new game
            positions = mixUpTiles(config.gridSize);
            saveGame(image, positions);
        }
        setTilePositions(positions);
    }, [config.gridSize, image]);

    useEffect(() => {
        const resize = debounce(() => {
            setConfig(calcDimensions(gridSize));
        }, 500);
        resize();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [gridSize]);

    // determine movement
    const handleMove = useCallback(
        direction => {
            const blankPos = tilePositions[gridSize * gridSize - 1];
            const nextPos = getTargetPosition(gridSize, blankPos, direction);
            const nextPositions = calcTileMovement(gridSize, blankPos, nextPos, tilePositions);

            if (nextPositions !== false) {
                setTilePositions(nextPositions);
                saveGame(image, nextPositions);
            }
        },
        [gridSize, tilePositions, image]
    );

    // handle keypress
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 37) {
                handleMove('left');
            } else if (event.keyCode === 38) {
                handleMove('up');
            } else if (event.keyCode === 39) {
                handleMove('right');
            } else if (event.keyCode === 40) {
                handleMove('down');
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleMove]);

    const numTiles = gridSize * gridSize;

    if (isSolved(tilePositions)) {
        return (
            <div onClick={onFinish}
                 className="winner"
                 style={{backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
        );
    } else {
        return (
            <div style={{display:'flex'}}>
                <div className={'squares squares-' + gridSize}
                     style={{width:config.imageSize,height:config.imageSize}}>
                    {[...Array(numTiles).keys()].map(id => (
                        <Tile key={id}
                              id={id}
                              image={image}
                              gridSize={gridSize}
                              tileSize={config.tileSize}
                              handleClick={() => handleMove(id)}
                              position={tilePositions[id]}
                              isBlank={id === numTiles - 1} />
                    ))}
                </div>
                <Controls handleMove={handleMove} handleExit={exit} />
            </div>
        );
    }
}

export default Puzzle;