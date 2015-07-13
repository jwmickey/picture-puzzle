import React, { Component } from 'react';

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return <h1>Hello!</h1>;
    }
}