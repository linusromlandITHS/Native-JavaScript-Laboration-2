let params = {
    headers: {}
};

const githubUsername = localStorage.getItem("githubusername")
const githubpersonaltoken = localStorage.getItem("githubpersonaltoken")


if (githubUsername && githubpersonaltoken) { //If available in local storage
    params.headers = {
        "Authorization": `${githubUsername}:${githubpersonaltoken}`
    }
}

getUser = async (username) => {
    let request = await fetch(`https://api.github.com/users/${username}`, params)
    outOfRequests(request)
    if (request.status === 404) return null;
    let data = await request.json();
    return data;
}

getRepo = async (repo) => {
    let request = await fetch(`https://api.github.com/repos/${repo}`, params)
    outOfRequests(request)
    if (request.status === 404) return null;
    let data = await request.json();
    return data;
}

searchUser = async (username) => {
    const request = await fetch(`https://api.github.com/search/users?q=${username}`, params)
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

getCommits = async (user) => {
    let i = 1;
    let commits = []
    while (true) {
        const request = await fetch(`https://api.github.com/users/${user}/events/public?sort=pushed&per_page=100&page=${i}`, params)
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

outOfRequests = (request) => {
        if (request.status === 403) {
            let path = `${window.location.origin + window.location.pathname.substring(0,window.location.pathname.length-9)}getToken.html`
            const errorMessage = githubUsername && githubpersonaltoken ? `You are out of request!` : `You are out of request! You have 60 request/hour.\nYou can get more (5000 request/hour) if you authenticate with GitHub and Personal Token!\nTo do this, visit: \n${path}`
            
            alert(errorMessage)
            }
        }