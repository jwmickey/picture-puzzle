const hash = require('crypto').createHash;

function md5(input) {
    return hash('md5').update(input).digest('hex');
}

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d;
}

export function saveGame(image, positions) {
    const gameId = md5(image);
    window.localStorage.setItem(`ppuzz_${gameId}`, JSON.stringify(positions));
}

export function loadGame(image) {
    const gameId = md5(image);
    const asJson = window.localStorage.getItem(`ppuzz_${gameId}`);
    if (false) { // asJson != null) {
        return JSON.parse(asJson);
    } else {
        return null;
    }
}

export function clearGame(image) {
    const gameId = md5(image);
    window.localStorage.removeItem(`ppuzz_${gameId}`);
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
    // const movements = ['left'];

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