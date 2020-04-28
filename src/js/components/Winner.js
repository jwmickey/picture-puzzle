import React from 'react';

export default function Winner({ image, close }) {
    return (
        <div onClick={close}
             className="winner"
             style={{backgroundSize:'cover',backgroundImage: 'url('+ image +')'}}><h1>WINNER!</h1></div>
    )
}