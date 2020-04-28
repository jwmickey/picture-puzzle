import React from 'react';

export default function Winner({ image, close }) {
    return (
        <div onClick={close}
             className="winner"
             style={{backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
    )
}