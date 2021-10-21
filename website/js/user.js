const usernameTag = document.querySelector("#username")
const loadingArea = document.querySelector("#loadingArea")
const main = document.querySelector("#main")

let user;
let name;
window.onload = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let user = await getUser(params.user);
    if(!user) window.location = "index.html"
    console.log("Loaded user data!")
    name = user.name ? user.name : user.login;
    document.title = `${user.login} - Github Statistics`
    username.textContent = name
    loading(true)
}

loading = (done) => {
    
    main.hidden = done ? false : true;
    loadingArea.hidden = done ? true : false
}

