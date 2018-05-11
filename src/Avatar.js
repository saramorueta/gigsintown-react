import React from 'react';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            alt: props.alt
        };
    }

    render() {
        const {url, alt} = this.state;

        return (<img src={url} alt={alt}/>);
    }
}

export default Avatar;