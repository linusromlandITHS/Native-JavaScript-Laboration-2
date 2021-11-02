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
