import { createHash } from 'crypto';

function md5(input) {
    return createHash('md5').update(input).digest('hex');
}

export class Game {
    constructor(gridSize, image, autoStart = true) {
        this.subscribers = [];
        this.gridSize = gridSize;
        this.image = image;
        this.tiles = [...Array(gridSize * gridSize).keys()];
        this.setScreenSize(Math.min(window.innerWidth, window.innerHeight));
        this.positions = [...Array(gridSize * gridSize).keys()];
        this.gameId = md5((!image ? 'numbers' : image) + ':' + gridSize);

        if (autoStart) {
            if (!this.load()) {
                this.randomize();
            }
        }
    }

    getConfig() {
        return {
            gridSize: this.gridSize,
            image: this.image,
            imageSize: this.imageSize,
            tileSize: this.tileSize,
        }
    }

    setScreenSize(size) {
        this.imageSize = size - 20;
        this.tileSize = this.imageSize / this.gridSize;
        this.publishUpdates();
    }

    randomize(moves = 50, lastDir = null) {
        let choices;
        switch (lastDir) {
            case 'up': choices = ['up', 'left', 'right']; break;
            case 'down': choices = ['down', 'left', 'right']; break;
            case 'left': choices = ['left', 'up', 'down']; break;
            case 'right': choices = ['right', 'up', 'down']; break;
            default: choices = ['up', 'right']; break;
        }
        const dir = choices[Math.floor(Math.random() * choices.length)];
        if (this.canMoveInDirection(dir)) {
            this.moveInDirection(dir);
            if (moves > 0) {
                setTimeout(() => this.randomize(--moves, dir), 125);
            }
        } else {
            this.randomize(moves, lastDir);
        }
    }

    getPositions() {
        return this.positions;
    }

    setPositions(positions, publish = true, save = true) {
        this.positions = positions;
        if (save) {
            this.save();
        }
        if (publish) {
            this.publishUpdates();
        }
    }

    publishUpdates() {
        this.subscribers.forEach(sub => sub({
            positions: this.positions,
            config: this.getConfig()
        }));
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        const idx = this.subscribers.findIndex(s => s === subscriber);
        if (idx !== false) {
            this.subscribers = this.subscribers.splice(idx, 1);
        }
    }

    save() {
        window.localStorage.setItem(`picpuzz_${this.gameId}`, JSON.stringify(this.positions));
    }

    load() {
        const asJson = window.localStorage.getItem(`picpuzz_${this.gameId}`);
        if (asJson != null) {
            this.setPositions(JSON.parse(asJson));
            return true;
        }
        return false;
    }

    reset() {
        this.setPositions([...Array(this.gridSize * this.gridSize).keys()]);
        setTimeout(() => this.randomize(), 1000);
    }

    isSolved() {
        return this.positions.every((t, i) => t === i);
    }

    getBlankPos() {
        return this.positions[this.positions.length - 1];
    }

    getTargetPosition(direction) {
        const blankPos = this.getBlankPos();
        switch (direction) {
            case 'left': return blankPos - 1;
            case 'up': return blankPos - this.gridSize;
            case 'right': return blankPos + 1;
            case 'down': return blankPos + this.gridSize;
            default: return undefined;
        }
    }

    positionToCoords(position) {
        const x = position % this.gridSize;
        const y = Math.floor(position / this.gridSize);
        return [x, y];
    }

    coordsToPosition(coords) {
        return coords[0] + coords[1] * this.gridSize;
    }

    getTileAtPosition(position) {
        return this.positions.findIndex(tp => tp === position);
    }

    canMoveInDirection(direction) {
        const coords = this.positionToCoords(this.getBlankPos());
        switch (direction) {
            case 'left':
                return coords[0] > 0;
            case 'right':
                return coords[0] < this.gridSize - 1;
            case 'up':
                return coords[1] > 0;
            case 'down':
                return coords[1] < this.gridSize - 1;
        }
    }

    moveInDirection(direction) {
        if (this.canMoveInDirection(direction)) {
            const targetPosition = this.getTargetPosition(direction);
            const currentPosition = this.getBlankPos();
            const tileId = this.getTileAtPosition(targetPosition);
            const nextPositions = [...this.positions];
            nextPositions[this.positions.length - 1] = targetPosition;
            nextPositions[tileId] = currentPosition;
            this.setPositions(nextPositions);
        }
        return this.positions;
    }
}