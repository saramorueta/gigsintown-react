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

    onLoginStatus(loginInfo) {
        const onSuccess = this.onSuccess;
        const FacebookStatus = new FacebookStatusStrategy({
            loginInfo,
            onSuccess
        });

        FacebookStatus.contextInterface();
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
