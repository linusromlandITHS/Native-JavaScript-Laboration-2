window.onload = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let repo = await getRepo(params.repo);
    if(!repo) window.location = "index.html"
    console.log(repo)
}