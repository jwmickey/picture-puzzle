import React from 'react';

function Controls({ handleMove, handleExit }) {
    return (
        <div className="controls">
            <div className="dpad">
                <div className="up" onClick={() => handleMove('up')}>⬆️</div>
                <div className="left" onClick={() => handleMove('left')}>⬅️</div>
                <div className="right" onClick={() => handleMove('right')}>➡️</div>
                <div className="down" onClick={() => handleMove('down')}>⬇️</div>
            </div>
            <div>
                <button onClick={handleExit}>Finish Later</button>
            </div>
        </div>
    );
}

export default Controls;