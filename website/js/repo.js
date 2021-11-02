const nameTag = document.querySelector("#name")
bio = document.querySelector("#bio")
latestCommits = document.querySelector("#latestCommits")
latestCommitsList = document.querySelector("#latestCommits>ul")

window.onload = async () => {
    initPartials()

    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets repo from GitHub API
    const repo = await getRepo(params.repo);
    
    //Redirects client if repo not found
    if (!repo) window.location = "index.html"
    const pullRequests = await repoToPullRequests(repo)
    const issues = await repoToIssues(repo)
    const topLanguages = await repoToLanguages(repo);
    const events = await getRepositoryEvents(repo.full_name);

    console.log(events)

    displayPullRequests(pullRequests)
    displayIssues(issues)
    displayTopLanguages(topLanguages)
    displayLatestCommits(events)
    displayName(repo)

    //Fake loading
    let fakeloading = true;
    setTimeout(() => {
        fakeloading = false;
        loading()
    }, 400)

    if (!fakeloading) loading()
    checkToken()
}

/**
 * @param  {object} user Object containing the user information
 * 
 * Sets the username DOMs and updated metadata.
 */
 displayName = (repo) => {
    document.title = `${repo.name} - Github Statistics`
    nameTag.textContent = repo.name


    //If GitHub repo has bio set, shows bio in field.
    if (repo.description) {
        bio.textContent = repo.description
        bio.hidden = false;
    }
}
/**
 * @param  {array} eventArray Array of Events directly from GitHub's API
 * 
 * Converts the eventArray from GitHub's API to a object with the amount of commits each day and the total number of commits in each repository.
 */
 eventArrayToChart = (eventArray) => {
    eventArray = eventArray.reverse(); //reverse array to get oldest first

    const object = {
        amount: [],
        day: [],
        topRepositories: null,
    }

    const topRepositories = []

    for (let i = 0; i < eventArray.length; i++) { //Loops through commits
        const commit = eventArray[i];
        const date = moment(commit.created_at.split("T")[0]) //Converts date to momentObject
        const diff = date.diff(moment(object.day[object.day.length - 1]), "days")
        if (diff > 1) {
            const newDate = moment(object.day[object.day.length - 1])
            for (let i = 0; i < diff - 1; i++) {
                newDate.add(1, "days")
                object.day.push(newDate.format("YYYY-MM-DD"))
                object.amount.push(0)
            }
        }
        const index = object.day.findIndex((e) => e === date.format("YYYY-MM-DD")) //Checks if date is in date array
        if (index === -1) { // if date is not in array and either adds it or updates amount.
            object.day.push(date.format("YYYY-MM-DD"))
            object.amount.push(commit.payload.commits.length)
        } else {
            object.amount[index] += commit.payload.commits.length
        }

        const repoIndex = topRepositories.findIndex((e) => e.repo === commit.repo.name) //Checks if repo is in repo array
        if (repoIndex === -1) {
            topRepositories.push({
                repo: commit.repo.name,
                amount: commit.payload.commits.length
            })
        } else {
            topRepositories[repoIndex].amount += commit.payload.commits.length
        }
    }

    while (object.day.at(-1) !== moment(new Date()).format("YYYY-MM-DD")) {
        const newDate = moment(object.day.at(-1))
        newDate.add(1, "days")
        object.day.push(newDate.format("YYYY-MM-DD"))
        object.amount.push(0)
    }

    topRepositories.sort((a, b) => b.amount - a.amount) // Sorts array by no of commits
    object.topRepositories = topRepositories //Sets topRepositories to topRepositories in object

    return object
}
