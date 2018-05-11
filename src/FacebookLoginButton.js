import React from 'react';
import FacebookStatusStrategy from './FacebookStatusStrategy';

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

    onLoginStatus(response) {
        const FacebookStatus = new FacebookStatusStrategy(response.status);
        FacebookStatus.ContextInterface(this.onSuccess);

        // if (response.status === 'connected') {
        //     console.log('Logged in.');
        //
        //     if (response.authResponse) {
        //         this.onLogin(response);
        //     }
        //
        // } else {
        //     window.FB.login(this.onLogin.bind(this), {scope: 'email'});
        // }
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
