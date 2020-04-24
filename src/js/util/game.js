const hash = require('crypto').createHash;

function md5(input) {
    return hash('md5').update(input).digest('hex');
}

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d;
}

export function saveGame(image, positions, tiles) {
    const gameId = md5(image);
    window.localStorage.setItem(`${gameId}_positions`, JSON.stringify(positions));
    if (tiles !== undefined) {
        window.localStorage.setItem(`${gameId}_tiles`, JSON.stringify(tiles));
    }
}

export function loadGame(image) {
    const gameId = md5(image);
    const tiles = window.localStorage.getItem(`${gameId}_tiles`);
    const positions = window.localStorage.getItem(`${gameId}_positions`);
    if (tiles && positions) {
        return {
            tiles: JSON.parse(tiles),
            positions: JSON.parse(positions)
        };
    } else {
        return false;
    }
}

export function getTargetPosition(gridSize, blankPos, direction) {
    const sr = Math.sqrt(gridSize);
    switch (direction) {
        case 'left': return blankPos - 1;
        case 'up': return blankPos - sr;
        case 'right': return blankPos + 1;
        case 'down': return blankPos + sr;
        default: return undefined;
    }
}

export function calcTileMovement(gridSize, blankPos, nextPos, currentPositions) {
    const gridSqrt = Math.sqrt(gridSize);
    const tileId = currentPositions.findIndex(tp => tp === nextPos);
    const tilePos = currentPositions[tileId];

    if ((tilePos - gridSqrt === blankPos) ||    // move up
        (tilePos + gridSqrt === blankPos) ||    // move down
        ((Math.abs(tilePos - blankPos) === 1) && // move left or right
            (Math.ceil((tilePos + 1) / gridSqrt) === Math.ceil((blankPos + 1) / gridSqrt))))
    {
        const blankId = gridSize - 1;
        let positions = [...currentPositions];
        let tmp = positions[blankId];
        positions[blankId] = tilePos;
        positions[tileId] = tmp;
        return positions;
    }

    return false;
}

export function createTiles(gridSize, picSize, bgOffset) {
    const gridSqrt = Math.sqrt(gridSize);
    let t = Array(gridSize);
    for (let i = 0; i < t.length; i++) {
        t[i] = {
            id: i,
            bgX: (i % gridSqrt) * picSize * bgOffset,
            bgY: Math.floor(i / gridSqrt) * picSize * bgOffset
        };
    }
    return t;
}

export function mixUpTiles(gridSize, difficulty = 5) {
    // difficulty should be between 1 and 10, inclusive
    difficulty = Math.max(1, Math.min(10, difficulty));

    let p = [];
    for (let i = 0; i < gridSize; i++) {
        p.push(i);
    }

    // TODO: generate some random movements
    const movements = [
        'left', 'up', 'right', 'up', 'left', 'down', 'left', 'up', 'right', 'down', 'down',
        'left', 'up', 'right', 'right', 'right', 'down', 'down', 'left', 'up', 'up', 'left'
    ];

    // move the puzzle around.
    p = movements.reduce((shuffled, direction) => {
        const blankPos = shuffled[gridSize - 1];
        const nextPos = getTargetPosition(gridSize, blankPos, direction);
        const nextPositions = calcTileMovement(gridSize, blankPos, nextPos, shuffled);
        return nextPositions === false ? shuffled : nextPositions;
    }, p);

    return p;
}

export function isSolved(positions) {
    return positions.every((t, i) => t === i);
}