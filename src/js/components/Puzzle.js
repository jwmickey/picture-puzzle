import React, { useEffect, useState, useCallback } from 'react';
import Tile from './Tile';

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d;
}

function Puzzle({ gridSize, gridSqrt, picSize, bgOffset, image, onFinish }) {
    const blankId = gridSize - 1;
    const [tiles, setTiles] = useState([]);
    const [tilePositions, setTilePositions] = useState([]);

    // initial setup
    useEffect(() => {
        let t = [];
        let p = [];
        let positions = Array.apply(null, {length: gridSize}).map(Number.call, Number);
        // TODO: this may result in an unsolvable puzzle
        shuffle(positions);
        for (let i = 0; i < gridSize; i++) {
            t.push({
                id: i,
                bgX: (i % gridSqrt) * picSize * bgOffset,
                bgY: Math.floor(i / gridSqrt) * picSize * bgOffset
            });
            p.push(positions[i]);
        }
        setTiles(t);
        setTilePositions(p);
    }, [gridSize, gridSqrt, picSize, bgOffset]);

    // determine movement
    const handleMove = useCallback(
        direction => {
            const blankPos = tilePositions[blankId];
            let nextPos;
            switch (direction) {
                case 'left':
                    nextPos = blankPos - 1;
                    break;
                case 'up':
                    nextPos = blankPos - gridSqrt;
                    break;
                case 'right':
                    nextPos = blankPos + 1;
                    break;
                case 'down':
                    nextPos = blankPos + gridSqrt;
                    break;
            }

            const tileId = tilePositions.findIndex(tp => tp === nextPos);
            const pos = tilePositions[tileId];

            if ((pos - gridSqrt === blankPos) ||    // move up
                (pos + gridSqrt === blankPos) ||    // move down
                ((Math.abs(pos - blankPos) === 1) && // move left or right
                    (Math.ceil((pos + 1) / gridSqrt) === Math.ceil((blankPos + 1) / gridSqrt))))
            {
                let positions = [...tilePositions];
                let tmp = positions[blankId];
                positions[blankId] = pos;
                positions[tileId] = tmp;
                setTilePositions(positions);
            }
        },
        [blankId, gridSqrt, tilePositions]
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

    function isSorted() {
        return tilePositions.every((t, i) => t === i);
    }

    if (isSorted()) {
        return (
            <div onClick={onFinish}
                 className="winner"
                 style={{backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
        );
    } else {
        return (
            <div className={'squares squares-' + gridSize} data-lastupdate={(new Date()).toTimeString()}
                 style={{backgroundImage: 'url('+ image +')'}}>
                {tiles.map(tile => {
                    if (tile.id === blankId) {
                        return <div key={tile.id} style={{order: tilePositions[tile.id], backgroundImage: 'none'}} />
                    } else {
                        return <Tile key={tile.id}
                                     handleClick={() => handleMove(tile.id)}
                                     position={tilePositions[tile.id]}
                                     {...tile} />
                    }
                })}
            </div>
        );
    }
}

export default Puzzle;