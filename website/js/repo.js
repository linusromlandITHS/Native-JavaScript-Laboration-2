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
 * @param  {array} arr Array Containing latest events
 * 
 * Converts latest events (input) and then displays 5 latest commits
 */
 displayLatestCommits = (arr) => {
    arr = arr.reverse();

    const commits = []
    let i = 0;
    while (commits.length < 8 && arr.length > 0) {
        if (arr[i].type === "PushEvent") { // Checkes that event is of type PushEvent.
            arr[i].payload.commits.forEach(element => {
                commits.push({
                    commitInformation: arr[i],
                    commit: element
                })
                commits[commits.length - 1].commitInformation.payload = {};
            });
            if (i > arr.length) break;
        }
        i++;
    }
    const amount = commits.length > 8 ? 8 : commits.length

    if (amount) latestCommits.hidden = false;
    for (let i = 0; i < amount; i++) {
        const element = commits[i];
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = `https://github.com/${element.commitInformation.repo.name}/commit/${element.commit.sha}`;


        const title = document.createElement("h3")
        title.innerHTML = `<strong>${element.commit.author.name}</strong> pushed to repository`

        const message = document.createElement("p")
        message.textContent = `${element.commit.message}`

        const date = document.createElement("p")
        date.textContent = `${moment(element.commitInformation.created_at).calendar(null, {
            lastDay : '[Yesterday at] HH:mm',
            sameDay : '[Today at] HH:mm',
            nextDay : '[Tomorrow at] HH:mm',
            lastWeek : '[last] dddd [at] HH:mm',
            nextWeek : 'dddd [at] HH:mm',
            sameElse : 'L'
        })}`

        a.append(title, message, date)
        li.appendChild(a)

        latestCommitsList.appendChild(li)
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
