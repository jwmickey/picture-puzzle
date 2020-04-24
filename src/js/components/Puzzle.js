import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Tile from './Tile';
import { saveGame, loadGame, getTargetPosition, calcTileMovement, mixUpTiles, isSolved } from '../util/game';


function Puzzle({ gridSize, image, onFinish, exit }) {
    const [tilePositions, setTilePositions] = useState([]);
    const config = useMemo(() => {
        const gridSqrt = Math.sqrt(gridSize);
        return {
            gridSize,
            gridSqrt,
            squareSize: 500 / gridSqrt,
            bgOffset: 1 / gridSqrt,
            picSize: 500
        }
    }, [gridSize]);

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

    // determine movement
    const handleMove = useCallback(
        direction => {
            const blankPos = tilePositions[gridSize - 1];
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

    if (isSolved(tilePositions)) {
        return (
            <div onClick={onFinish}
                 className="winner"
                 style={{backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
        );
    } else {
        return (
            <>
                <div className={'squares squares-' + gridSize}>
                    {[...Array(gridSize).keys()].map(id => (
                        <Tile key={id}
                              id={id}
                              image={image}
                              gridSize={gridSize}
                              tileSize={config.squareSize}
                              handleClick={() => handleMove(id)}
                              position={tilePositions[id]}
                              isBlank={id === gridSize - 1} />
                    ))}
                </div>
                <div className="controls">
                    <button onClick={exit}>Finish Later</button>
                </div>
            </>
        );
    }
}

export default Puzzle;