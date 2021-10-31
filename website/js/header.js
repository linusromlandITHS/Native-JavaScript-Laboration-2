checkToken = async () => {
  const authArea = document.querySelector("#authArea");
  const personalToken = localStorage.getItem("githubpersonaltoken");
  if (personalToken) {
    let request = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${personalToken}`
        }
    });
    let data = await request.json();
    if(data.login){
        const name = data.name ? data.name : data.login;
        const p = document.createElement("p")
        p.textContent = `Authenticated as ${name}`
        authArea.appendChild(p);
    }else{
        const a = document.createElement("a");
        a.classList = "nav-link";
        a.href= "./authenticate.html"
        a.textContent = "Authenticate"
        authArea.appendChild(a);
    }
  }
};
