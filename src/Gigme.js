
function getGigMeAuthToken({
    FBToken = null,
    onSuccess = () => {}
}) {

    var callback = onSuccess;

    if (FBToken == null) {
        // call onError
        return false;
    }

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
            debugger;
            console.log('Request succeeded with JSON response', json);
            callback(json);
        })
}

export default {getGigMeAuthToken};