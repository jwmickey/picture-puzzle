import React, {useEffect, useState} from 'react';
import debounce from 'debounce';
import Start from './Start';
import Puzzle from './Puzzle';
import images from '../images';
import { Game } from '../game';

const GRID_SIZES  = [3, 4, 5, 6, 7, 8];
const DEFAULT_CONFIG = {
    gridSize: 4,
    image: null
};

function App() {
    const [inProgress, setInProgress] = useState(false);
    const [puzzleConfig, setPuzzleConfig] = useState(DEFAULT_CONFIG);
    const [game, setGame] = useState(null);

    // handle resize events
    useEffect(() => {
        const resize = debounce(() => {
            game.setScreenSize(Math.min(window.innerWidth, window.innerHeight));
        }, 1000);

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [game]);

    function start(gridSize, preset) {
        setPuzzleConfig({
            gridSize,
            image: preset
        });
        setGame(new Game(gridSize, preset));
        setInProgress(true);
    }

    function reset() {
        setPuzzleConfig(DEFAULT_CONFIG);
        setInProgress(false);
    }

    if (inProgress) {
        return (
            <Puzzle game={game}
                    onExit={() => setInProgress(false)}
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