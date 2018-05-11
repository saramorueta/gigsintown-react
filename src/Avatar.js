import React from 'react';
import Gigme from './Gigme';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            internalToken: props.internalToken,
            loaded: false
        };
    }

    componentWillMount(){
        const internalToken = this.state.internalToken; // get that value from some model
        Gigme.getUserInfo(internalToken).then(userInfo => {
            this.setState({
                userInfo: {
                    pictureUrl: userInfo.pictureUrl,
                    firstName: userInfo.firstName
                }
            });

            this.setState({loaded: true});
        });
    }

    render() {
        const readyToRender = this.state.loaded;
        return (readyToRender && <img src={this.state.userInfo.pictureUrl} alt={this.state.userInfo.firstName}/>);
    }
}

export default Avatar;