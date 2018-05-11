
function getGigMeAuthToken({
    FBToken = null
}) {

    return fetch('https://gigsintown.herokuapp.com/user/auth/facebook', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ token: FBToken })
    })
        .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
}


function getUserInfo(internalToken) {
    return fetch('https://gigsintown.herokuapp.com/user/info', {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "Authorization": `bearer ${internalToken}`
        }
    })
        .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
}

export default {
    getGigMeAuthToken,
    getUserInfo
};