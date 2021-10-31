checkToken = async () => {
  const authArea = document.querySelector("#authArea");
  const navItemsArea = document.querySelector("#navItemsArea")
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

        // Profile Image
        const profileImage = document.createElement("img")
        profileImage.alt = "Authenticated Profile Image"
        profileImage.src = `${data.avatar_url}&s=55`
        profileImage.width = 35
        profileImage.height = 35
        profileImage.style.borderRadius = "999px"

        authArea.append(p, profileImage);
    }else{
        const a = document.createElement("a");
        a.classList = "nav-link";
        a.href= "./authenticate.html"
        a.textContent = "Authenticate"
        authArea.appendChild(a);
    }
  }
};
