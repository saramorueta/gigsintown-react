class FacebookStatusStrategy {
    constructor(type) {
        switch (type) {
            case "connected":
                this.strategy = new Connected();
                break;
            case "not_authorized":
                this.strategy = new NotAuthorized();
                break;
            default:
                this.strategy = new Unknown();
        }
    }
    ContextInterface(callback) {
        this.strategy.AlgorithmInterface();
        this.strategy.onSuccess = callback; // can I do this differently? events?
    }
}

class Strategy {
    constructor() {
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
    constructor() {
        super();
        console.log('Connected created')
    }

    AlgorithmInterface(){
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire


    }
}

class NotAuthorized extends Strategy {
    constructor() {
        super();
        console.log('NotAuthorized created')
    }

    AlgorithmInterface() {
        // the user must go through the login flow
        // to authorize your app or renew authorization
    }
}

class Unknown extends Strategy {
    constructor() {
        super();
        console.log('Unknown created')
    }

    AlgorithmInterface () {
        // the user isn't logged in to Facebook.
        window.FB.login(this.onAuthenticated.bind(this), {scope: 'email'});
    }
}

export default FacebookStatusStrategy;