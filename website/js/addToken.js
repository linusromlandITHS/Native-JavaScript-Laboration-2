// Retrives of HTML DOM elements
const form = document.querySelector("form")
 githubPersonalToken = document.querySelector("#GithubPersonalToken")
 addToken = document.querySelector("#addToken")
 loginWithGithub = document.querySelector("#loginWithGithub")

window.onload = () => {

    const apiDomain = "githubStats.romland.space"

    //TODO add check if URL is correct
    if(window.location.host == apiDomain){
        loginWithGithub.hidden = false;
        addToken.style.display = "none"
    }

    initPartials()
}

//Runs on submit on form
form.addEventListener("submit", async event => {
    event.preventDefault();
    if (githubPersonalToken) {
        //updates entries in localstorage and redirect client.
        await localStorage.setItem("githubpersonaltoken", githubPersonalToken.value)
        window.location = "/"
    }
})
