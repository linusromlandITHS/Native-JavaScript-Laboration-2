const _githubUsername = localStorage.getItem("githubusername")
 _githubPersonalToken = localStorage.getItem("githubpersonaltoken")

let _params = {};

if (_githubUsername && _githubPersonalToken) _params.headers = {
    "Authorization": `Basic ${btoa(_githubUsername + ":" + _githubPersonalToken)}`
}

console.log(_params);
/**
 * @param  {string} username github accounts username 
 * 
 * Retrives Github User from GitHub's API
 */
getUser = async (username) => {
    let request = await fetch(`https://api.github.com/users/${username}`, _params)
    outOfRequests(request)
    if (request.status === 404) return null;
    let data = await request.json();
    return data;
}

/**
 * @param  {string} repo github repo name 
 * 
 * Retrives Github Repository from GitHub's API
 */
getRepo = async (repo) => {
    let request = await fetch(`https://api.github.com/repos/${repo}`, _params)
    outOfRequests(request)
    if (request.status === 404) return null;
    let data = await request.json();
    return data;
}

/**
 * @param  {string} username
 * 
 * Searches for username that matches input in GitHub's API
 */
searchUser = async (username) => {
    const request = await fetch(`https://api.github.com/search/users?q=${username}`, _params)
    outOfRequests(request)
    const data = await request.json();
    let users = data.items;
    while (true) {
        let index = users.findIndex(o => o.type === "Organization")
        if (index === -1) {
            break;
        } else {
            users.splice(index, 1)
        }
    }
    return users;
}

/**
 * @param  {string} user github accounts username
 * 
 * Retrives all events for user from GitHub's API
 */
getEvents = async (user) => {
    let i = 1;
    let commits = []
    while (true) {
        const request = await fetch(`https://api.github.com/users/${user}/events/public?sort=pushed&per_page=100&page=${i}`, _params)
        if (request.status !== 200) break;
        outOfRequests(request)
        const data = await request.json();
        commits = commits.concat(data);
        i++;
    }
    let j = 0;
    while (true) {
        let index = commits.findIndex(e => e.type !== "PushEvent")
        if (index == -1) break;
        else commits.splice(index, 1);
    }

    return commits;
}

/**
 * @param  {Response} request response object from fetch request
 * 
 * Checks if your out of request on GitHub's API and displays error if you're out.
 */
outOfRequests = (request) => {
    if (request.status === 403) {
        let path = `${window.location.origin + window.location.pathname.substring(0,window.location.pathname.length-9)}getToken.html`
        const errorMessage = _githubUsername && _githubPersonalToken ? `You are out of request!` : `You are out of request! You have 60 request/hour.\nYou can get more (5000 request/hour) if you authenticate with GitHub and Personal Token!\nTo do this, visit: \n${path}`

        alert(errorMessage)
    }
}