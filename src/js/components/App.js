import React, { useState } from 'react';
import Start from './Start';
import Puzzle from './Puzzle';
import images from '../images';

const GRID_SIZES  = [9, 16, 25, 36, 49, 64];
const DEFAULT_CONFIG = {
    gridSize: 16,
    image: null
};

function App() {
    const [inProgress, setInProgress] = useState(false);
    const [puzzleConfig, setPuzzleConfig] = useState(DEFAULT_CONFIG);

    function start(gridSize, preset) {
        setPuzzleConfig({
            gridSize,
            image: preset
        });
        setInProgress(true);
    }

    function reset() {
        setPuzzleConfig(DEFAULT_CONFIG);
        setInProgress(false);
    }

    if (inProgress) {
        return (
            <Puzzle {...puzzleConfig}
                    exit={() => setInProgress(false)}
                    onFinish={reset} />
        );
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