// Retrives of HTML DOM elements
const form = document.querySelector("form")
 githubUsername = document.querySelector("#GithubUsername")
 githubPersonalToken = document.querySelector("#GithubPersonalToken")

//Runs on submit on form
form.addEventListener("submit", async event => {
    event.preventDefault();
    if (githubPersonalToken && githubUsername) {
        //updates entries in localstorage and redirect client.
        await localStorage.setItem("githubusername", githubUsername.value)
        await localStorage.setItem("githubpersonaltoken", githubPersonalToken.value)
        window.location = "index.html"
    }
})