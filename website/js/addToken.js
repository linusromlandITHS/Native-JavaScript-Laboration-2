// Retrives of HTML DOM elements
const form = document.querySelector("form")
const GithubUsername = document.querySelector("#GithubUsername")
const GithubPersonalToken = document.querySelector("#GithubPersonalToken")

//Runs on submit on form
form.addEventListener("submit", async event => {
    event.preventDefault();
    if (GithubPersonalToken && GithubUsername) {
        //updates entries in localstorage and redirect client.
        await localStorage.setItem("githubusername", GithubUsername.value)
        await localStorage.setItem("githubpersonaltoken", GithubPersonalToken.value)
        window.location = "index.html"
    }
})