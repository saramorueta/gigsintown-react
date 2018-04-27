import React from 'react';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            internalToken: props.internalToken,
            loaded: false
        };
    }

    componentWillMount(){
        this.getUserInfo().then(userInfo => {
            this.setState({
                userInfo: {
                    pictureUrl: userInfo.pictureUrl,
                    firstName: userInfo.firstName
                }
            });

            this.setState({loaded: true});
        });
    }
 
    getUserInfo() {
        return fetch('https://gigsintown.herokuapp.com/user/info', {
            method: 'get',
            headers: {
                "Content-type": "application/json",
                "Authorization": `bearer ${this.state.internalToken}`
            }
        })
        .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
    }

    render() {
        const readyToRender = this.state.loaded;
        return (readyToRender && <img src={this.state.userInfo.pictureUrl} alt={this.state.userInfo.firstName}/>);
    }
}

export default Avatar;