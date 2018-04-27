import React from 'react';

class FacebookLoginButton extends React.Component {

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
        fetch('https://gigsintown.herokuapp.com/user/auth/facebook', {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ token: FBToken })
        })
        .then(function (data) {
            console.log('Request succeeded with JSON response', data);
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }

    onLogin(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');

            const FBToken = response.authResponse.accessToken;
            this.getGigMeAuthToken(FBToken);

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }

    onLoginStatus(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');

            if (response.authResponse) {
                const FBToken = response.authResponse.accessToken;
                this.getGigMeAuthToken(FBToken);
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
