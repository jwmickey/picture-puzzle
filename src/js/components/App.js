import React, {useEffect, useState} from 'react';
import debounce from 'debounce';
import Start from './Start';
import Puzzle from './Puzzle';
import images from '../images';
import { Game } from '../game';

const CUSTOM_KEY = 'picpuzz_custom_image';
const GRID_SIZES  = [3, 4, 5, 6, 7, 8];
const DEFAULT_CONFIG = {
    gridSize: 4,
    image: null
};

function loadImage() {
    return window.localStorage.getItem(CUSTOM_KEY);
}

function saveImage(data) {
    window.localStorage.setItem(CUSTOM_KEY, data);
}

function App() {
    const [inProgress, setInProgress] = useState(false);
    const [puzzleConfig, setPuzzleConfig] = useState(DEFAULT_CONFIG);
    const [customImage, setCustomImage] = useState(loadImage());
    const [game, setGame] = useState(null);

    // handle resize events
    useEffect(() => {
        if (game == null) {
            return;
        }

        const resize = debounce(() => {
            game.setScreenSize(Math.min(window.innerWidth, window.innerHeight));
        }, 1000);

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [game]);

    function updateCustomImage(image) {
        saveImage(image);
        setCustomImage(image);
    }

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
                   customImage={customImage}
                   saveCustomImage={updateCustomImage}
                   gridSize={puzzleConfig.gridSize} />
        );
    }
}

export default App;