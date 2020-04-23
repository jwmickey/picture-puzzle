import React, { Component } from 'react';
import images from './images';

const GRID_SIZES  = [9, 16, 25, 36, 49, 64];

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            puzzle: {
                picSize: 500,
                gridSize: 16,
                gridSqrt: Math.sqrt(16),
                squareSize: 500 / 4,
                bgOffset: 1 / 4,
                image: null
            },
            inProgress: false
        };
    }

    start(gridSize, preset) {
        let puzzle = this.state.puzzle;
        puzzle.gridSize = gridSize;
        puzzle.gridSqrt = Math.sqrt(puzzle.gridSize);
        puzzle.squareSize = 500 / puzzle.gridSqrt;
        puzzle.bgOffset = 1 / puzzle.gridSqrt;
        puzzle.image = preset;

        this.setState({
            puzzle: puzzle,
            inProgress: true
        });
    }

    render() {
        if (this.state.inProgress) {
            return <Puzzle {...this.state.puzzle} />;
        } else {
            return (
                <Start images={images} sizes={GRID_SIZES} start={this.start.bind(this)}
                    gridSize={this.state.puzzle.gridSize} />
            );
        }
    }
}

class Start extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridSize: props.gridSize,
            imageIndex: 0
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.start(
            this.state.gridSize,
            this.props.images[this.state.imageIndex]
        );
    }

    selectGridSize(size) {
        this.setState({
            gridSize: size
        });
    }

    selectImage(index) {
        this.setState({
            imageIndex: index
        });
    }

    render() {
        var that = this;
        return (
            <div className="start">
                <div className="button-group">
                    <h3>Number of Tiles</h3>
                    {this.props.sizes.map(function(size) {
                        return <button className={that.state.gridSize == size ? 'selected' : ''}
                                       onClick={that.selectGridSize.bind(that, size)}>{size}</button>;
                    })}
                </div>

                <div className="button-group images">
                    <h3>Image</h3>
                    {this.props.images.map(function(img, i) {
                        return <button className={that.state.imageIndex == i ? 'selected' : ''}
                                       onClick={that.selectImage.bind(that, i)}><img src={img}/></button>;
                    })}
                </div>

                <div className="button-group">
                    <button onClick={this.handleSubmit.bind(this)}>Start Game</button>
                </div>
            </div>
        );
    }
}

class Puzzle extends Component {
    constructor(props) {
        super(props);

        // get a list of random sorting for square positions
        let positions = Array.apply(null, {length: this.props.gridSize}).map(Number.call, Number);
        shuffle(positions);
        shuffle(positions);
        shuffle(positions);

        let squares = [];
        for (var i = 0; i < this.props.gridSize; i++) {
            squares.push({
                id: i,
                position: positions[i],
                bgX: (i % this.props.gridSqrt) * this.props.picSize * this.props.bgOffset,
                bgY: Math.floor(i / this.props.gridSqrt) * this.props.picSize * this.props.bgOffset
            });
        }

        this.state = {
            blankId: this.props.gridSize - 1,
            squares: squares
        };
    }

    isSorted() {
        for (var i = 0; i < this.state.squares.length; i++) {
            if (this.state.squares[i].position !== i) {
                return false;
            }
        }

        return true;
    }

    getBlankPos() {
        return this.state.squares[this.state.blankId].position;
    }

    getSquareIdAt(pos) {
        for (var i = 0; i < this.state.squares.length; i++) {
            if (this.state.squares[i].position === pos) {
                return i;
            }
        }

        return null;
    }

    handleMove(squareId) {
        if (squareId == null) {
            return;
        }

        let pos = this.state.squares[squareId].position;
        let blankPos = this.getBlankPos();

        if ((pos - this.props.gridSqrt === blankPos) ||    // move up
            (pos + this.props.gridSqrt === blankPos) ||    // move down
            ((Math.abs(pos - blankPos) === 1) && // move left or right
             (Math.ceil((pos + 1) / this.props.gridSqrt) === Math.ceil((blankPos + 1) / this.props.gridSqrt))))
        {

            let squares = this.state.squares;
            let tmp = squares[this.state.blankId].position;
            squares[this.state.blankId].position = pos;
            squares[squareId].position = tmp;
            this.setState({ squares }, null);
        }
    }

    handleKeyDown(event) {
        let blankPos = this.getBlankPos();

        if (event.keyCode === 37) {  // left
            this.handleMove(this.getSquareIdAt(blankPos - 1));
        } else if (event.keyCode === 38) { // up
            this.handleMove(this.getSquareIdAt(blankPos - this.props.gridSqrt));
        } else if (event.keyCode === 39) { // right
            this.handleMove(this.getSquareIdAt(blankPos + 1));
        } else if (event.keyCode === 40) { // down
            this.handleMove(this.getSquareIdAt(blankPos + this.props.gridSqrt));
        }
    }

    solve() {
        // TODO ;)
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    render() {
        let blankId = this.state.blankId;
        let handleMove = this.handleMove.bind(this);

        if (this.isSorted()) {
            return (
                <div key="winner" className="winner"
                     style={{backgroundImage: 'url('+ this.props.image +')'}}><h1>WINNER!</h1></div>
            );
        } else {
            return (
                <div key="squares" className={"squares squares-" + this.props.gridSize}
                    style={{backgroundImage: 'url('+ this.props.image +')'}}>
                    {this.state.squares.map(function (square) {
                        if (square.id === blankId) {
                            return <Blank key={square.id} {...square} />
                        } else {
                            return <Square key={square.id} {...square} clickHandler={handleMove}/>
                        }
                    })}
                </div>
            );
        }
    }
}


class Square extends Component {
    click() {
        this.props.clickHandler(this.props.id);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.position !== nextProps.position;
    }

    render() {
        let styles = {
            backgroundPosition: '-' + this.props.bgX + 'px -' + this.props.bgY + 'px',
            order: this.props.position
        };

        return (
            <div style={styles} onClick={this.click.bind(this)} />
        );
    }
}

class Blank extends Component {
    render() {
        let styles = {
            backgroundPosition: '-' + this.props.bgX + 'px -' + this.props.bgY + 'px',
            order: this.props.position,
            backgroundImage: 'none'
        };

        return (
            <div style={styles} />
        );
    }
}