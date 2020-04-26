import { useState, useEffect } from 'react';

export default function useGame(game) {
    const [positions, setPositions] = useState(game.getPositions());
    const [config, setConfig] = useState(game.getConfig());

    useEffect(() => {
        function handleUpdates(data) {
            setPositions(data.positions);
            setConfig(data.config);
        }

        game.subscribe(handleUpdates);
        return () => {
            game.unsubscribe(handleUpdates);
        }
    });

    return {
        positions,
        config
    };
}