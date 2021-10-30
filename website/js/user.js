// Retrives of HTML DOM elements
const nameTag = document.querySelector("#name")
usernameTag = document.querySelector("#username")
loadingArea = document.querySelector("#loadingArea")
main = document.querySelector("#main")
commitAmount = document.querySelector("#commitAmount")
topRepositories = document.querySelector("#topRepositories")
topRepositoriesList = document.querySelector("#topRepositories>ul")
profilePicture = document.querySelector("#profilePicture")
latestCommits = document.querySelector("#latestCommits")
latestCommitsList = document.querySelector("#latestCommits>ul")
bio = document.querySelector("#bio")
pullRequestsDOM = document.querySelector("#pullRequests")
pullRequestsList = document.querySelector("#pullRequests>ul")
issues = document.querySelector("#issues")
topLanguages = document.querySelector("#topLanguages")
topLanguagesList = document.querySelector("#topLanguages>ol")

let _user, _name;

window.onload = async () => {
    initPartials()

    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets user from GitHub API
    const user = await getUser(params.user);
    const userRepos = await getUserRepos(params.user)
    const pullRequests = await reposToPullRequests(userRepos)
    const issues = await reposToIssues(userRepos)
    const topLanguages = await reposToLanguages(userRepos);

    //Redirects client if user not found
    if (!user) window.location = "index.html"


    let events = await getEvents(user.login)
    let chartData = await eventArrayToChart(events)
    await renderChart(chartData.amount, chartData.day, "#chart", "line", "Commits")

    //Displays diffrent information on load of site
    displayName(user)
    displayTopRepos(chartData.topRepositories)
    displayCommitAmount(chartData)
    displayProfilePicture(user)
    displayLatestCommits(events)
    displayPullRequests(pullRequests)
    displayIssues(issues)
    displayTopLanguages(topLanguages)

    //Fake loading
    let fakeloading = true;
    setTimeout(() => {
        fakeloading = false;
        loading()
    }, 400)

    if (!fakeloading) loading()
}

/**
 * 
 * Shows the main content and hides loading display
 */
loading = () => {
    console.log("Loading complete!")
    main.style.display = "flex";
    loadingArea.style.display = "none"
}

/**
 * @param  {object} user Object containing the user information
 * 
 * Sets the username DOMs and updated metadata.
 */
displayName = (user) => {
    //Sets varible "name" to login or Username if exsits.
    name = user.name ? user.name : user.login;
    document.title = `${user.login} - Github Statistics`
    nameTag.textContent = name

    //If GitHub profile has name set, shows login name in other field.
    if (user.name) {
        usernameTag.textContent = user.login
        usernameTag.hidden = false;
    }

    //If GitHub profile has bio set, shows bio in field.
    if(user.bio){
        bio.textContent = user.bio
        bio.hidden = false;
    }

    document.querySelector('meta[name="description"]').setAttribute("content", `Github Statistics for user ${user.login}`);
}

/**
 * @param  {array} pulls Array of all pull requests.
 * 
 * Converts inputed array to list items containg information and appends dem to pullRequestsDOM
 */
displayPullRequests = async (pulls) => {
    let elements = []
    let openPullRequests = 0;
    let closedPullRequests = 0;

    for (let i = 0; i < pulls.length; i++) {
        const pull = pulls[i];
        if(pull.state == "open"){
            //Main list item
            const li = document.createElement("li")

            //Annchor tag for link
            const a = document.createElement("a")
            a.href = pull.html_url
            
            //Container to contain main content
            const container = document.createElement("div")

            //Title
            const h2 = document.createElement("h2")
            h2.textContent = pull.title

            //Reponame
            const repoName = document.createElement("p")
            repoName.textContent = "Repository: " + pull.base.repo.full_name

            //Updated at time
            const created = document.createElement("p")
            created.textContent = "Last updated: " + moment(pull.updated_at).format("dddd, MMMM Do YYYY, HH:mm")

            //Appends title and time to container
            container.append(h2, repoName, created)

            //Appends container to anchor
            a.append(container)

            //Appends anchor to list item
            li.appendChild(a)

            //Pushes list item to array
            elements.push(li)

            //Increases openPullRequests by one
            openPullRequests++;
        }else{
            //Increases closedPullRequests by one
            closedPullRequests++;
        }
        if(elements.length >= 5) break;
    }
    //P tag that displays how many open and closed pull requests in public repos.
    const requestsOpen = document.createElement("p")
    requestsOpen.textContent = `${openPullRequests} open / ${closedPullRequests} closed`

    pullRequestsDOM.appendChild(requestsOpen)
    elements.forEach(element => pullRequestsList.appendChild(element));
    pullRequestsDOM.hidden = false
}

/**
 * @param  {array} issuesArray 
 * 
 * Converts issue array to show on html
 */
displayIssues = (issuesArray) => {
    openIssues = 0;
    closedIssues = 0;

    issuesArray.forEach(issue => {
        if(issue.state == "open") openIssues++;
        else closedIssues++;
    });

    const p = document.createElement("p")
    p.textContent = `${openIssues} open / ${closedIssues} closed`
    issues.appendChild(p)
    issues.hidden = false;
}

/**
 * @param  {array} arr Object array of the top repositories
 * 
 * Loops through the top repositories (max 5) and displays them in the DOM.
 */
displayTopRepos = (arr) => {
    let amount = arr.length > 5 ? 5 : arr.length

    if (amount) topRepositories.hidden = false;
    for (let i = 0; i < amount; i++) {
        const element = arr[i];
        let li = document.createElement("li");
        li.innerHTML = `Repo: <a href="https://github.com/${element.repo}/">${element.repo}</a> (Commits: ${element.amount})`
        topRepositoriesList.appendChild(li)
    }
}

/**
 * @param  {object} data Object containing all commits (amount and day)
 * 
 * Adds all commmits to one number and displays in DOM.
 */
displayCommitAmount = (data) => {
    let commits = data.amount.length > 0;
    if (commits) {
        data.amount.forEach(amount => {
            commits += parseInt(amount)
        });
        commitAmount.textContent = `Commits (${data.day[0]} - ${data.day[data.day.length -1]}): ${commits}`
        commitAmount.hidden = false;
    }
}
/**
 * @param  {array} arr Array Containing latest events
 * 
 * Converts latest events (input) and then displays 5 latest commits
 */
displayLatestCommits = (arr) => {
    arr = arr.reverse();

    let commits = []
    let i = 0;
    while (commits.length < 5) {
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
    let amount = commits.length > 5 ? 5 : commits.length

    if (amount) latestCommits.hidden = false;
    for (let i = 0; i < amount; i++) {
        const element = commits[i];        
        let li = document.createElement("li");

        let title = document.createElement("p")
        title.textContent = `Pushed to repository ${element.commitInformation.repo.name}`

        let message = document.createElement("p")
        message.textContent = `${element.commit.message}`

        let date = document.createElement("p")
        date.textContent = `${moment(element.commitInformation.created_at).calendar(null, {
            lastDay : '[Yesterday at] HH:mm',
            sameDay : '[Today at] HH:mm',
            nextDay : '[Tomorrow at] HH:mm',
            lastWeek : '[last] dddd [at] HH:mm',
            nextWeek : 'dddd [at] HH:mm',
            sameElse : 'L'
        })}`

        li.appendChild(title)
        li.appendChild(message)
        li.appendChild(date)

        latestCommitsList.appendChild(li)
    }
}

/**
 * @param  {object} user Object containing the user information
 * 
 * Displays the profile picture of user in image DOM
 */
displayProfilePicture = (user) => {
    profilePicture.setAttribute('src', `${user.avatar_url}&s=250`)
}

/**
 * @param  {arrays} topLangs Array containg the most popular languages in repos
 * 
 * Displays the 5 most popular languages on user page
 */
displayTopLanguages = (topLangs) => {
    let elements = []

    topLanguages.hidden = false;

    for (let i = 0; i < topLangs.length; i++) {
        const lang = topLangs[i];
        // Main listitem
        const li = document.createElement("li")

        //Text DOM
        const p = document.createElement("p")
        p.textContent = lang.lang

        li.appendChild(p)
        elements.push(li)

        if(elements.length >= 5) break;
    }


    elements.forEach(element => {
        topLanguagesList.appendChild(element)
    });
}

/**
 * @param  {array} eventArray Array of Events directly from GitHub's API
 * 
 * Converts the eventArray from GitHub's API to a object with the amount of commits each day and the total number of commits in each repository.
 */
eventArrayToChart = (eventArray) => {
    eventArray = eventArray.reverse(); //reverse array to get oldest first

    let object = {
        amount: [],
        day: [],
        topRepositories: null,
    }

    let topRepositories = []

    for (let i = 0; i < eventArray.length; i++) { //Loops through commits
        const commit = eventArray[i];
        let date = moment(commit.created_at.split("T")[0]) //Converts date to momentObject
        let diff = date.diff(moment(object.day[object.day.length - 1]), "days")
        if (diff > 1) {
            let newDate = moment(object.day[object.day.length - 1])
            for (let i = 0; i < diff - 1; i++) {
                newDate.add(1, "days")
                object.day.push(newDate.format("YYYY-MM-DD"))
                object.amount.push(0)
            }
        }
        let index = object.day.findIndex((e) => e === date.format("YYYY-MM-DD")) //Checks if date is in date array
        if (index === -1) { // if date is not in array and either adds it or updates amount.
            object.day.push(date.format("YYYY-MM-DD"))
            object.amount.push(commit.payload.commits.length)
        } else {
            object.amount[index] += commit.payload.commits.length
        }

        let repoIndex = topRepositories.findIndex((e) => e.repo === commit.repo.name) //Checks if repo is in repo array
        if (repoIndex === -1) {
            topRepositories.push({
                repo: commit.repo.name,
                amount: commit.payload.commits.length
            })
        } else {
            topRepositories[repoIndex].amount += commit.payload.commits.length
        }
    }

    topRepositories.sort((a, b) => b.amount - a.amount) // Sorts array by no of commits
    object.topRepositories = topRepositories //Sets topRepositories to topRepositories in object

    return object
}

/**
 * @param  {array} repoArray
 * 
 * Converts repoarray to the top languages
 */
reposToLanguages = (repoArray) => {
    let topLangs = []
    repoArray.forEach(async repo => {
        const languages = await fetchURL(repo.languages_url)
        for (const lang in languages) {
            let index = topLangs.findIndex((e) => e.lang == lang)
            if(index == -1){
                topLangs.push({
                    lang: lang,
                    amount: languages[lang]
                })
            }else{
                topLangs[index].amount += languages[lang]
            }
            topLangs.sort((a, b) => b.amount - a.amount)
          }
    });
    return topLangs
}

/**
 * @param  {array} repoArray
 * 
 * Converts repoarray to the issues
 */
reposToIssues = (repoArray) => {
    let issues = []
    repoArray.forEach(async repo => {
        const issueFromRepo = await fetchURL(`${repo.url}/issues?state=all`)
        issues.push(...issueFromRepo)
    });
    return issues
}

/**
 * @param  {array} repoArray
 * 
 * Converts repoarray to the pulls
 */
 reposToPullRequests = async (repoArray) => {
    let pullRequests = []
    repoArray.forEach(async repo => {
        const pullRequestsFromRepo = await fetchURL(`${repo.url}/pulls?state=all`)
        pullRequests.push(...pullRequestsFromRepo)
    });
    return pullRequests
}

/**
 * @param  {array} dataPoints Data points for chart
 * @param  {array} categories Categories for chart
 * @param  {string} selector Selector (id, class etc. of DOM) to insert chart to
 * @param  {string} type Type of chart (line etc.)
 * @param  {string} name Name of Chart
 * 
 * Renders Chart to choosen DOM with inputed data
 */
renderChart = (dataPoints, categories, selector, type, name) => {
    if (dataPoints.length > 0) {
        var options = {
            chart: {
                type: type
            },
            series: [{
                name: name,
                data: dataPoints
            }],
            xaxis: {
                categories: categories
            }
        }

        var chart = new ApexCharts(document.querySelector(selector), options);

        chart.render();
        document.querySelector(selector).hidden = false;
    }
}