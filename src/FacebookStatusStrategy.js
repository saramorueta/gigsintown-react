class FacebookStatusStrategy {
    constructor({
        loginInfo = {},
        onSuccess = () => {}
    }) {
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

class Strategy {
    constructor({loginInfo, onSuccess}) {
        this.loginInfo = loginInfo;
        this.onSuccess = onSuccess;
    }

    AlgorithmInterface() {
    }

    onAuthenticated(response) {
        console.log('Welcome!  Fetching your information.... ');
        const FBToken = response.authResponse.accessToken;
        this.getGigMeAuthToken.call(this, FBToken); // verify inside here if token is valid
    }

    // move this out
    getGigMeAuthToken(FBToken) {
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
}

class Connected extends Strategy {
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

class NotAuthorized extends Strategy {
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

class Unknown extends Strategy {
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

export default FacebookStatusStrategy;