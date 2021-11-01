window.onload = async () => {
    initPartials()

    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets repo from GitHub API
    let repo = await getRepo(params.repo);
    //Redirects client if repo not found
    if (!repo) window.location = "index.html"
}