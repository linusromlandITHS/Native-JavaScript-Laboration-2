window.onload = async () => {
    initPartials()

    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets repo from GitHub API
    let repo = await getRepo(params.repo);
    //Redirects client if repo not found
    if (!repo) window.location = "index.html"

    const pullRequests = await reposToPullRequests([repo])
    const issues = await reposToIssues([repo])
    const topLanguages = await reposToLanguages([repo]);

    console.log(pullRequests, issues, topLanguages);

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
    checkToken()

}