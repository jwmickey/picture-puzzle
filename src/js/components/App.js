import React, { useState } from 'react';
import Start from './Start';
import Puzzle from './Puzzle';
import images from '../images';

const GRID_SIZES  = [9, 16, 25, 36, 49, 64];
const DEFAULT_CONFIG = {
    picSize: 500,
    gridSize: 16,
    gridSqrt: 4,
    squareSize: 500 / 4,
    bgOffset: 1 / 4,
    image: null
};

function App() {
    const [inProgress, setInProgress] = useState(false);
    const [puzzleConfig, setPuzzleConfig] = useState(DEFAULT_CONFIG);

    // TODO: refactor this - the puzzle can keep most of this in it's own state
    function start(gridSize, preset) {
        puzzleConfig.gridSize = gridSize;
        puzzleConfig.gridSqrt = Math.sqrt(puzzleConfig.gridSize);
        puzzleConfig.squareSize = 500 / puzzleConfig.gridSqrt;
        puzzleConfig.bgOffset = 1 / puzzleConfig.gridSqrt;
        puzzleConfig.image = preset;

        setPuzzleConfig(puzzleConfig);
        setInProgress(true);
    }

    function reset() {
        setPuzzleConfig(DEFAULT_CONFIG);
        setInProgress(false);
    }

    if (inProgress) {
        return <Puzzle {...puzzleConfig} onFinish={reset} />;
    } else {
        return (
            <Start images={images}
                   sizes={GRID_SIZES}
                   start={start}
                   gridSize={puzzleConfig.gridSize} />
        );
    }
}

export default App;