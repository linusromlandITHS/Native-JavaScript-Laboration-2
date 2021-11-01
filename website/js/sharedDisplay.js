const pullRequestsDOM = document.querySelector("#pullRequests")
pullRequestsList = document.querySelector("#pullRequests>ul")
issues = document.querySelector("#issues")
topLanguages = document.querySelector("#topLanguages")
topLanguagesList = document.querySelector("#topLanguages>ol")

/**
 * @param  {array} pulls Array of all pull requests.
 * 
 * Converts inputed array to list items containg information and appends dem to pullRequestsDOM
 */
 displayPullRequests = async (pulls) => {
    // console.log(pulls)
    // console.log(pulls.length)
    // console.log(JSON.stringify(pulls))
    const elements = []
    let openPullRequests = 0;
    let closedPullRequests = 0;

    for (let i = 0; i < pulls.length; i++) {
        const pull = pulls[i];
        if (pull.state == "open") {
            //Main list item
            const li = document.createElement("li")

            //Annchor tag for link
            const a = document.createElement("a")
            a.href = pull.html_url

            //Container to contain main content
            const container = document.createElement("div")

            //Title
            const h2 = document.createElement("h2")
            h2.textContent = `#${pull.number} - ${pull.title}`

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
        } else {
            //Increases closedPullRequests by one
            closedPullRequests++;
        }
        if (elements.length >= 5) break;
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
        if (issue.state == "open") openIssues++;
        else closedIssues++;
    });

    const p = document.createElement("p")
    p.textContent = `${openIssues} open / ${closedIssues} closed`
    issues.appendChild(p)
    issues.hidden = false;
}

/**
 * @param  {arrays} topLangs Array containg the most popular languages in repos
 * 
 * Displays the 5 most popular languages on user page
 */
 displayTopLanguages = (topLangs) => {
    const elements = []

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

        if (elements.length >= 5) break;
    }


    elements.forEach(element => {
        topLanguagesList.appendChild(element)
    });
}