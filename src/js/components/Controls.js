import React from 'react';

function Controls({ handleMove, handleExit, handleReset }) {
    return (
        <div className="controls">
            <div className="buttons">
                <button onClick={handleExit}>Finish Later</button>
                <button onClick={() => confirm('Are you sure?') && handleReset()}>Start Over</button>
            </div>
            <div className="dpad">
                <div className="up" onClick={() => handleMove('up')}>⬆️</div>
                <div className="left" onClick={() => handleMove('left')}>⬅️</div>
                <div className="right" onClick={() => handleMove('right')}>➡️</div>
                <div className="down" onClick={() => handleMove('down')}>⬇️</div>
            </div>
        </div>
    );
}

export default Controls;