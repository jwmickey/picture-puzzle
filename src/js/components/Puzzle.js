import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Tile from './Tile';
import {saveGame, loadGame, getTargetPosition, calcTileMovement, mixUpTiles, createTiles, isSolved} from '../util/game';


function Puzzle({ gridSize, image, onFinish, exit }) {
    const [tiles, setTiles] = useState([]);
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
        const { gridSize, picSize, bgOffset } = config;
        const gameInProgress = loadGame(image);
        let t, p;

        if (gameInProgress !== false) {
            // load from saved game
            t = gameInProgress.tiles;
            p = gameInProgress.positions;
        } else {
            // start a new game
            t = createTiles(gridSize, picSize, bgOffset);
            p = mixUpTiles(gridSize);
            saveGame(image, p, t);
        }
        setTiles(t);
        setTilePositions(p);
    }, [config, image]);

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
                <div className={'squares squares-' + gridSize}
                     style={{backgroundImage: 'url('+ image +')'}}>
                    {tiles.map(tile => {
                        if (tile.id === gridSize - 1) {
                            return <div key={tile.id} style={{order: tilePositions[tile.id], backgroundImage: 'none'}} />
                        } else {
                            return <Tile key={tile.id}
                                         handleClick={() => handleMove(tile.id)}
                                         position={tilePositions[tile.id]}
                                         {...tile} />
                        }
                    })}
                </div>
                <div className="controls">
                    <button onClick={exit}>Finish Later</button>
                </div>
            </>
        );
    }
}

export default Puzzle;