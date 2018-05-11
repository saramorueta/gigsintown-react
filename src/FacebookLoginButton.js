import React from 'react';

import FacebookStatus from './FacebookStatus';

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
        debugger;
        const onSuccess = this.onSuccess;
        const Facebook = new FacebookStatus({
            loginInfo,
            onSuccess
        });

        Facebook.contextInterface();
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
