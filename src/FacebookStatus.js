import Gigme from './Gigme';

class FacebookStatus {
    constructor({
        loginInfo = {},
        onSuccess = () => {}
    }) {
        debugger;
        this.setStrategy({loginInfo, onSuccess});
    }

    contextInterface() {
        this.strategy.AlgorithmInterface();
    }

    setStrategy({loginInfo, onSuccess}) {
        const status = loginInfo.status;
        let strategy = null;

        switch (status) {
            case "connected":
                strategy = Connected;
                break;
            case "not_authorized":
                strategy = NotAuthorized;
                break;
            default:
                strategy = Unknown;
        }

        this.strategy = new strategy({loginInfo, onSuccess});
    }
}

class FacebookStrategy {
    constructor({loginInfo, onSuccess}) {
        this.loginInfo = loginInfo;
        this.onSuccess = onSuccess;
    }

    // implemented for each particular strategy
    AlgorithmInterface() {}

    onAuthenticated(response) {
        console.log('Welcome!  Fetching your information.... ');
        const FBToken = response.authResponse.accessToken;
        const onSuccess = this.onSuccess;
        Gigme.getGigMeAuthToken.call(this, {FBToken, onSuccess});
    }
}

class Connected extends FacebookStrategy {
    constructor({loginInfo, onSuccess}) {
        super({loginInfo, onSuccess});
        this.name = 'Connected';

        console.log('Connected created')
    }

    AlgorithmInterface(){
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        const loginInfo = this.loginInfo;
        this.onAuthenticated(loginInfo);
    }
}

class NotAuthorized extends FacebookStrategy {
    constructor({loginInfo, onSuccess}) {
        super({loginInfo, onSuccess});
        this.name = "NotAuthorized";
        console.log('NotAuthorized created')
    }

    AlgorithmInterface() {
        // the user must go through the login flow
        // to authorize your app or renew authorization
    }
}

class Unknown extends FacebookStrategy {
    constructor({loginInfo, onSuccess}) {
        super({loginInfo, onSuccess});
        this.name = 'Unknown';
        console.log('Unknown created')
    }

    AlgorithmInterface () {
        // the user isn't logged in to Facebook.
        window.FB.login(this.onAuthenticated.bind(this), {scope: 'email'});
    }
}

export default FacebookStatus;