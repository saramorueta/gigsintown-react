import React from 'react';

class FacebookLoginButton extends React.Component {
    constructor(props) {
        super(props);
        this.onSuccess = this.props.onSuccess.bind(this);
    }

    componentDidMount() {
        if (window.FB) {
            window.FB.init({
                appId      : '113460019464423',
                cookie     : true,
                xfbml      : true,
                version    : 'v2.12'
            });

            window.FB.AppEvents.logPageView();
        }
    }

    getGigMeAuthToken(FBToken) {
        console.log(FBToken)
        var onSuccess = this.onSuccess;
        fetch('https://gigsintown.herokuapp.com/user/auth/facebook', {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ token: FBToken })
        })
        .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
            console.log('Request succeeded with JSON response', json);
            onSuccess(json);
        })
    }

    onLogin(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            const FBToken = response.authResponse.accessToken;
            this.getGigMeAuthToken.call(this, FBToken);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }

    onLoginStatus(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');

            if (response.authResponse) {
                this.onLogin(response);
            }

        } else {
            window.FB.login(this.onLogin.bind(this), {scope: 'email'});
        }
    }

    loginFacebook(e) {
        e.preventDefault();
        window.FB.getLoginStatus(this.onLoginStatus.bind(this));
    }

    render() {
        return <button onClick={this.loginFacebook.bind(this)}>Login with Facebook</button>
    }
}

export default FacebookLoginButton;
