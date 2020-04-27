const Game = require('./game').Game;

test('initialization', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    const expectedConfig = {
        gridSize: 4,
        image: 'fake-image.jpg',
        imageSize: 480,
        bgOffset: (1 / 480),
        tileSize: (480 / 4)
    };

    expect(g.getConfig()).toStrictEqual(expectedConfig);
    expect(g.getPositions()).toStrictEqual([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    expect(g.getBlankPos()).toBe(15);
});

test('coordsToPosition', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    expect(g.coordsToPosition([0, 0])).toBe(0);
    expect(g.coordsToPosition([1, 1])).toBe(5);
    expect(g.coordsToPosition([2, 2])).toBe(10);
    expect(g.coordsToPosition([3, 3])).toBe(15);
});

test('positionToCoords', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    expect(g.positionToCoords(1)).toStrictEqual([1, 0]);
    expect(g.positionToCoords(7)).toStrictEqual([3, 1]);
    expect(g.positionToCoords(13)).toStrictEqual([1, 3]);
});

test('getTargetPosition', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    expect(g.getBlankPos()).toBe(15);
    expect(g.getTargetPosition('left')).toBe(14);
    expect(g.getTargetPosition('up')).toBe(11);
});

test('canMoveInDirection', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    expect(g.getBlankPos()).toBe(15);
    expect(g.canMoveInDirection('down')).toBe(false);
    expect(g.canMoveInDirection('right')).toBe(false);
    expect(g.canMoveInDirection('up')).toBe(true);
    expect(g.canMoveInDirection('left')).toBe(true);
});

test('moveInDirection', () => {
    const g = new Game(4, 'fake-image.jpg', false);
    expect(g.getBlankPos()).toBe(15);
    expect(g.moveInDirection('left')).toStrictEqual([0,1,2,3,4,5,6,7,8,9,10,11,12,13,15,14]);
    expect(g.moveInDirection('up')).toStrictEqual([0,1,2,3,4,5,6,7,8,9,14,11,12,13,15,10]);
    expect(g.moveInDirection('up')).toStrictEqual([0,1,2,3,4,5,10,7,8,9,14,11,12,13,15,6]);
    expect(g.moveInDirection('right')).toStrictEqual([0,1,2,3,4,5,10,6,8,9,14,11,12,13,15,7]);
    expect(g.moveInDirection('down')).toStrictEqual([0,1,2,3,4,5,10,6,8,9,14,7,12,13,15,11]);
    expect(g.moveInDirection('down')).toStrictEqual([0,1,2,3,4,5,10,6,8,9,14,7,12,13,11,15]);
});
