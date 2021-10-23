const form = document.querySelector("form")
const GithubUsername = document.querySelector("#GithubUsername")
const GithubPersonalToken = document.querySelector("#GithubPersonalToken")

form.addEventListener("submit", async event => {
    event.preventDefault();
    if (GithubPersonalToken && GithubUsername) {
        await localStorage.setItem("githubusername", GithubUsername.value)
        await localStorage.setItem("githubpersonaltoken", GithubPersonalToken.value)
        window.location = "index.html"
    }
})